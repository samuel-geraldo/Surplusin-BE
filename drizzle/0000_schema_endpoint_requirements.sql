ALTER TABLE "penerima" ADD COLUMN IF NOT EXISTS "patokan" text;
--> statement-breakpoint
UPDATE "penerima" SET "jumlah_klaim" = 0 WHERE "jumlah_klaim" IS NULL;
--> statement-breakpoint
ALTER TABLE "penerima" ALTER COLUMN "jumlah_klaim" SET DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "penerima" ALTER COLUMN "jumlah_klaim" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "penyalur" ADD COLUMN IF NOT EXISTS "patokan" text;
--> statement-breakpoint
ALTER TABLE "klaim" ADD COLUMN IF NOT EXISTS "penyalur_id" integer;
--> statement-breakpoint
UPDATE "klaim"
SET "penyalur_id" = "donasi"."penyalur_id"
FROM "donasi"
WHERE "klaim"."donasi_id" = "donasi"."id"
  AND "klaim"."penyalur_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "klaim" ALTER COLUMN "penyalur_id" SET NOT NULL;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'klaim_penyalur_id_penyalur_id_fk'
  ) THEN
    ALTER TABLE "klaim"
      ADD CONSTRAINT "klaim_penyalur_id_penyalur_id_fk"
      FOREIGN KEY ("penyalur_id")
      REFERENCES "public"."penyalur"("id")
      ON DELETE no action
      ON UPDATE no action;
  END IF;
END $$;
