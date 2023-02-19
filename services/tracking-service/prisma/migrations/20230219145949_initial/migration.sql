-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "internalUserId" UUID NOT NULL,
    "sessionId" VARCHAR(256) NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "eventName" VARCHAR(256) NOT NULL,
    "page" VARCHAR(512) NOT NULL,
    "referrer" VARCHAR(512),
    "context" JSONB NOT NULL,
    "userId" VARCHAR(256),
    "userAgent" VARCHAR(256),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
