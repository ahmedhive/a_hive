import askHive from "@/features/hive/ask-hive";

export function POST(request: Request) {
  return askHive(request);
}
