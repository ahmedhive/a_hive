import transcribeHive from "@/features/hive/transcribe-hive";

export function POST(request: Request) {
  return transcribeHive(request);
}
