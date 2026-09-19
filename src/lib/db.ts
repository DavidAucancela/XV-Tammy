import { Pool } from "pg";

let _pool: Pool | null = null;

function getPool() {
  if (!_pool) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  }
  return _pool;
}

export type Guest = {
  id: string;
  nombre: string;
  pases: number;
  telefono: string | null;
  token: string;
  rsvp_estado: string | null;
  pases_confirmados: number | null;
  checked_in_at: string | null;
  created_at: string;
};

export async function getGuestByToken(token: string): Promise<Guest | null> {
  const { rows } = await getPool().query<Guest>(
    `select id, nombre, pases, telefono, token, rsvp_estado, pases_confirmados, checked_in_at, created_at
     from guests where token = $1`,
    [token]
  );
  return rows[0] ?? null;
}

/** Idempotente: solo marca check-in si todavía no estaba. */
export async function checkInGuest(token: string): Promise<{ checked_in_at: string } | null> {
  const { rows } = await getPool().query<{ checked_in_at: string }>(
    `update guests set checked_in_at = now()
     where token = $1 and checked_in_at is null
     returning checked_in_at`,
    [token]
  );
  return rows[0] ?? null;
}

export async function updateRsvp(
  token: string,
  rsvp_estado: "confirmado" | "rechazado",
  pases_confirmados: number
) {
  await getPool().query(
    `update guests set rsvp_estado = $2, pases_confirmados = $3 where token = $1`,
    [token, rsvp_estado, pases_confirmados]
  );
}

/** Busca por sufijo del teléfono (el número guardado puede tener código de país adelante). */
export async function findGuestByPhoneSuffix(digits: string): Promise<{ token: string; nombre: string } | null> {
  const { rows } = await getPool().query<{ token: string; nombre: string }>(
    `select token, nombre from guests where telefono like '%' || $1 limit 1`,
    [digits]
  );
  return rows[0] ?? null;
}

export async function listGuestsOrdered(): Promise<Guest[]> {
  const { rows } = await getPool().query<Guest>(
    `select id, nombre, pases, telefono, token, rsvp_estado, pases_confirmados, checked_in_at, created_at
     from guests order by created_at asc`
  );
  return rows;
}

/** Usado por el seed: inserta invitados nuevos, actualiza pases/teléfono de los existentes (por nombre). */
export async function listGuestsForSeed(): Promise<Array<{ id: string; nombre: string; token: string; pases: number; telefono: string | null }>> {
  const { rows } = await getPool().query(
    `select id, nombre, token, pases, telefono from guests`
  );
  return rows;
}

export async function insertGuest(guest: { nombre: string; pases: number; telefono: string | null; token: string }) {
  await getPool().query(
    `insert into guests (nombre, pases, telefono, token) values ($1, $2, $3, $4)`,
    [guest.nombre, guest.pases, guest.telefono, guest.token]
  );
}

export async function updateGuestPasesTelefono(id: string, pases: number, telefono: string | null) {
  await getPool().query(`update guests set pases = $2, telefono = $3 where id = $1`, [id, pases, telefono]);
}
