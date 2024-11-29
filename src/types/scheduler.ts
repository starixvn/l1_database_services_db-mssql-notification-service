import type { SchedulerEventDescription, TimerConfig } from "@ldb/scheduler";
export type SchedulerKeys = "NOTIFY";
export type SchedulerConfigs = Record<SchedulerKeys, TimerConfig>;
export type SchedulerEvents = SchedulerEventDescription<SchedulerConfigs>;
