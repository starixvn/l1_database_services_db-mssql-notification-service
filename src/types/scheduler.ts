import type { Scheduler as _Scheduler, FireListener, TimerConfig } from "@ldb/scheduler";
export type SchedulerKeys = "NOTIFY";
export type SchedulerEvents = Record<SchedulerKeys, FireListener>;
export type SchedulerConfigs = Record<SchedulerKeys, TimerConfig>;
export type Scheduler = _Scheduler<SchedulerKeys>;
