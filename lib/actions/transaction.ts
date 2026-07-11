/**
 * Transaction guidance for multi-table writes.
 *
 * The Supabase JS client does not expose SQL BEGIN/COMMIT. Atomic
 * multi-table mutations should use Postgres functions (RPC) in a
 * future migration when a sprint needs them.
 *
 * This helper runs operations sequentially and fails fast — it is NOT
 * a true database transaction and must not be used where rollback is
 * required across tables.
 */
export async function runSequentialOperations(
  operations: Array<() => Promise<void>>,
): Promise<void> {
  for (const operation of operations) {
    await operation();
  }
}
