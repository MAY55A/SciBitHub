import { describe, expect, it } from "vitest";
import {
  fieldInputDataSchema,
  projectInputDataSchema,
  taskInputDataSchema,
} from "@/src/types/project-form-data";
import {
  FieldType,
  ModerationLevel,
  ParticipationLevel,
  ProjectDomain,
  ProjectVisibility,
  Scope,
  TaskType,
} from "@/src/types/enums";

describe("project-form-data validation schemas", () => {
  const validField = {
    label: "Observation Notes",
    type: FieldType.TEXT,
    required: true,
  };

  const validTask = {
    title: "Classify Night Sky Images",
    description: "Review telescope captures and label visible celestial objects.",
    tutorial: "Inspect the central frame and select the closest matching object class.",
    type: TaskType.DATALABELLING,
    targetCount: 100,
    fields: [validField],
  };

  const validProject = {
    name: "Urban Light Pollution Mapping",
    shortDescription: "Community-driven night sky brightness monitoring across cities.",
    longDescription: "A".repeat(200),
    domain: ProjectDomain.ASTRONOMY,
    scope: Scope.GLOBAL,
    visibility: ProjectVisibility.PUBLIC,
    participationLevel: ParticipationLevel.OPEN,
    moderationLevel: ModerationLevel.MODERATE,
    tasks: [validTask],
  };

  it("accepts a valid field input payload", () => {
    const result = fieldInputDataSchema.safeParse(validField);
    expect(result.success).toBe(true);
  });

  it("rejects a task without at least one field", () => {
    const result = taskInputDataSchema.safeParse({
      ...validTask,
      fields: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Task needs at least one field");
    }
  });

  it("accepts a valid project input payload", () => {
    const result = projectInputDataSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it("enforces minimum character lengths on project name and descriptions", () => {
    const result = projectInputDataSchema.safeParse({
      ...validProject,
      name: "Abc",
      shortDescription: "Too short",
      longDescription: "Still too short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path[0]);
      expect(fields).toEqual(
        expect.arrayContaining(["name", "shortDescription", "longDescription"])
      );
    }
  });

  it("rejects invalid enum values for domain and visibility", () => {
    const result = projectInputDataSchema.safeParse({
      ...validProject,
      domain: "Invalid Domain",
      visibility: "unlisted",
    });

    expect(result.success).toBe(false);
  });
});