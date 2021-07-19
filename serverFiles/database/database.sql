CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "email" varchar(200) UNIQUE,
  "verified" boolean
);

CREATE TABLE "passwords" (
  "id" serial PRIMARY KEY,
  "customer_id" integer,
  "hashed_pw" text
);

CREATE TABLE "reading_plans" (
  "id" varchar(500) UNIQUE PRIMARY KEY,
  "customer_id" integer,
  "plan_details" text,
  "plan_scheme" text
);

CREATE TABLE "email_verification" (
  "id" serial PRIMARY KEY,
  "user_email" varchar(200),
  "verification_code" text,
  "expiry" bigint
);

CREATE TABLE "password_reset" (
  "id" serial PRIMARY KEY,
  "password_id" integer,
  "user_email" varchar(200),
  "verification_code" text,
  "expiry" bigint
);

ALTER TABLE "passwords" ADD FOREIGN KEY ("customer_id") REFERENCES "users" ("id");

ALTER TABLE "reading_plans" ADD FOREIGN KEY ("customer_id") REFERENCES "users" ("id");

ALTER TABLE "email_verification" ADD FOREIGN KEY ("user_email") REFERENCES "users" ("email");

ALTER TABLE "password_reset" ADD FOREIGN KEY ("password_id") REFERENCES "passwords" ("id");

ALTER TABLE "password_reset" ADD FOREIGN KEY ("user_email") REFERENCES "users" ("email");
