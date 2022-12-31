import { Environment } from "@/models/environment";

export const isProduction = process.env.NODE_ENV === Environment.production;
export const isTest = process.env.NODE_ENV === Environment.test;
export const isDevelopment = process.env.NODE_ENV === Environment.development;

// A crazy big timestamp that indicates how long before azure table storage
// completely ***ks up trying to insert a negative row key
export const AZURE_SELF_DESTRUCT_TIMER = "999999999999999999999999999999";
export const AZURE_MAX_BATCH_SIZE = 100;
