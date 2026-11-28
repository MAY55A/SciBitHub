import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentUserRole, getProjectPermissions } from "@/src/lib/services/permissions-service";
import { ParticipationLevel, ProjectVisibility, UserRole } from "@/src/types/enums";
import { createClient } from "@/src/utils/supabase/server";

vi.mock("@/src/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

interface MockSupabaseOptions {
  userId?: string | null;
  role?: UserRole | null;
  hasApprovedRequest?: boolean;
}

function mockSupabase({
  userId = null,
  role = null,
  hasApprovedRequest = false,
}: MockSupabaseOptions = {}) {
  const usersChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: role ? { role } : null }),
  };

  const requestsChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({
      data: hasApprovedRequest ? { id: "req-1" } : null,
    }),
  };

  const client = {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userId ? { id: userId } : null },
      }),
    },
    from: vi.fn((table: string) => {
      if (table === "users") return usersChain;
      if (table === "participation_requests") return requestsChain;
      throw new Error(`Unexpected table: ${table}`);
    }),
  };

  vi.mocked(createClient).mockResolvedValue(client as never);
  return client;
}

describe("permissions-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCurrentUserRole", () => {
    it("returns null when no user is authenticated", async () => {
      mockSupabase({ userId: null });
      await expect(getCurrentUserRole()).resolves.toBeNull();
    });

    it("returns the role for an authenticated user", async () => {
      mockSupabase({ userId: "user-1", role: UserRole.RESEARCHER });
      await expect(getCurrentUserRole()).resolves.toBe(UserRole.RESEARCHER);
    });
  });

  describe("getProjectPermissions", () => {
    it("grants full permissions to the project creator", async () => {
      mockSupabase({ userId: "creator-1" });

      const permissions = await getProjectPermissions(
        "proj-1",
        ProjectVisibility.PRIVATE,
        ParticipationLevel.RESTRICTED,
        "creator-1"
      );

      expect(permissions).toEqual({
        canViewResults: true,
        canEditResults: true,
        canViewContribution: true,
        canSendRequest: false,
      });
    });

    it("hides results for non-creators on private projects", async () => {
      mockSupabase({ userId: "other-user" });

      const permissions = await getProjectPermissions(
        "proj-1",
        ProjectVisibility.PRIVATE,
        ParticipationLevel.OPEN,
        "creator-1"
      );

      expect(permissions).toEqual({
        canViewResults: false,
        canEditResults: false,
        canViewContribution: true,
        canSendRequest: false,
      });
    });

    it("allows unapproved contributors on public-restricted projects to view results and request access", async () => {
      mockSupabase({
        userId: "contrib-1",
        role: UserRole.CONTRIBUTOR,
        hasApprovedRequest: false,
      });

      const permissions = await getProjectPermissions(
        "proj-1",
        ProjectVisibility.PUBLIC,
        ParticipationLevel.RESTRICTED,
        "creator-1"
      );

      expect(permissions).toEqual({
        canViewResults: true,
        canEditResults: false,
        canViewContribution: false,
        canSendRequest: true,
      });
    });

    it("grants contribution access to approved contributors on restricted projects", async () => {
      mockSupabase({
        userId: "contrib-1",
        role: UserRole.CONTRIBUTOR,
        hasApprovedRequest: true,
      });

      const permissions = await getProjectPermissions(
        "proj-1",
        ProjectVisibility.PUBLIC,
        ParticipationLevel.RESTRICTED,
        "creator-1"
      );

      expect(permissions).toEqual({
        canViewResults: true,
        canEditResults: false,
        canViewContribution: true,
        canSendRequest: false,
      });
    });
  });
});