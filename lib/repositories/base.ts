import { mapSupabaseError } from "@/lib/errors";

import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

/**
 * Base class for repositories. Subclasses receive a Supabase client via
 * constructor injection — never import createClient/createAdminClient here.
 *
 * Repositories isolate database access only. Business logic belongs in
 * services (features/<domain>/services/).
 */
export abstract class Repository {
  constructor(protected readonly client: SupabaseClient) {}

  protected assertNoError(error: PostgrestError | null): void {
    if (error) {
      throw mapSupabaseError(error);
    }
  }
}
