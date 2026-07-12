import { Repository } from "@/lib/repositories/base";

import type {
  ExperienceMode,
  EventType,
  OrderRow,
  OrderStatus,
} from "@/types/database";

import type { SupabaseClient } from "@supabase/supabase-js";

export type CreateOrderRpcParams = {
  themeId: string;
  senderName: string;
  receiverName: string;
  eventType: EventType;
  experienceMode: ExperienceMode;
  memoryKeyHash: string;
  buyerWhatsapp?: string | null;
  adminNotes?: string | null;
  scheduledDeliveryAt?: string | null;
};

export type CreateOrderRpcResult = {
  orderId: string;
  experienceId: string;
  orderNumber: string;
};

export type OrderListFilters = {
  status?: OrderStatus[];
  experienceMode?: ExperienceMode;
  scheduledOnOrBefore?: string;
  scheduledOnOrAfter?: string;
  limit?: number;
};

export type OrderWithExperience = OrderRow & {
  experiences: {
    id: string;
    experience_mode: ExperienceMode;
    status: string;
  } | null;
};

export class OrdersRepository extends Repository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  async createWithExperience(
    params: CreateOrderRpcParams,
  ): Promise<CreateOrderRpcResult> {
    const { data, error } = await this.client.rpc(
      "create_order_with_experience",
      {
        p_theme_id: params.themeId,
        p_sender_name: params.senderName,
        p_receiver_name: params.receiverName,
        p_event_type: params.eventType,
        p_experience_mode: params.experienceMode,
        p_memory_key_hash: params.memoryKeyHash,
        p_buyer_whatsapp: params.buyerWhatsapp ?? null,
        p_admin_notes: params.adminNotes ?? null,
        p_scheduled_delivery_at: params.scheduledDeliveryAt ?? null,
      },
    );

    this.assertNoError(error);

    const row = Array.isArray(data) ? data[0] : data;
    if (!row) {
      throw new Error("create_order_with_experience returned no row");
    }

    return {
      orderId: row.order_id as string,
      experienceId: row.experience_id as string,
      orderNumber: row.order_number as string,
    };
  }

  async findById(id: string): Promise<OrderRow | null> {
    const { data, error } = await this.client
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    this.assertNoError(error);
    return data as OrderRow | null;
  }

  async findMany(
    filters: OrderListFilters = {},
  ): Promise<OrderWithExperience[]> {
    let query = this.client
      .from("orders")
      .select("*, experiences ( id, experience_mode, status )")
      .order("created_at", { ascending: false });

    if (filters.status?.length) {
      query = query.in("status", filters.status);
    }

    if (filters.experienceMode) {
      query = query.eq("experience_mode", filters.experienceMode);
    }

    if (filters.scheduledOnOrAfter) {
      query = query.gte("scheduled_delivery_at", filters.scheduledOnOrAfter);
    }

    if (filters.scheduledOnOrBefore) {
      query = query.lte("scheduled_delivery_at", filters.scheduledOnOrBefore);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    this.assertNoError(error);
    return (data ?? []) as OrderWithExperience[];
  }
}
