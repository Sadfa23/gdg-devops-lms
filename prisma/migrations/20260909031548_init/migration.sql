-- CreateEnum
CREATE TYPE "Role" AS ENUM ('learner', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('pending', 'active', 'at_risk', 'suspended');

-- CreateEnum
CREATE TYPE "LessonVisibility" AS ENUM ('draft', 'scheduled', 'live');

-- CreateEnum
CREATE TYPE "LessonLevel" AS ENUM ('core', 'deep_dive', 'optional');

-- CreateEnum
CREATE TYPE "LessonProgressState" AS ENUM ('todo', 'current', 'done');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('recall', 'core', 'applied');

-- CreateEnum
CREATE TYPE "LabState" AS ENUM ('in_review', 'passed', 'changes_asked', 'overdue');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('draft', 'live');

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('guide', 'teardown', 'career', 'notes', 'security');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('para', 'head', 'image', 'diagram', 'video', 'code', 'note');

-- CreateEnum
CREATE TYPE "AccentColor" AS ENUM ('blue', 'red', 'yellow', 'green', 'none');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "image" TEXT,
    "registrationNumber" TEXT,
    "role" "Role" NOT NULL DEFAULT 'learner',
    "status" "UserStatus" NOT NULL DEFAULT 'pending',
    "focusArea" TEXT,
    "accent" "AccentColor" NOT NULL DEFAULT 'none',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" UUID NOT NULL,
    "moduleId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "videoPublicId" TEXT,
    "posterPublicId" TEXT,
    "captionsPublicId" TEXT,
    "transcript" TEXT,
    "durationSeconds" INTEGER,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" "LessonLevel" NOT NULL DEFAULT 'core',
    "visibility" "LessonVisibility" NOT NULL DEFAULT 'draft',
    "scheduledFor" TIMESTAMP(3),
    "position" INTEGER NOT NULL,
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "timecodeSeconds" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Takeaway" (
    "id" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Takeaway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "state" "LessonProgressState" NOT NULL DEFAULT 'todo',
    "watchedSeconds" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizSettings" (
    "id" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "passMarkPercent" INTEGER NOT NULL DEFAULT 70,
    "timeLimitMinutes" INTEGER NOT NULL DEFAULT 10,
    "attemptsAllowed" INTEGER NOT NULL DEFAULT 2,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT true,
    "shuffleOptions" BOOLEAN NOT NULL DEFAULT false,
    "showExplanationImmediately" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "QuizSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "prompt" TEXT NOT NULL,
    "topic" TEXT,
    "points" INTEGER NOT NULL DEFAULT 10,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'core',
    "explanation" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "scorePercent" INTEGER,
    "passed" BOOLEAN,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionResponse" (
    "id" UUID NOT NULL,
    "quizAttemptId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "selectedOptionId" UUID,
    "isCorrect" BOOLEAN NOT NULL,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" UUID NOT NULL,
    "moduleId" UUID,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rubricCriteriaCount" INTEGER,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabSubmission" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "state" "LabState" NOT NULL DEFAULT 'in_review',
    "grade" INTEGER,
    "feedback" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt" TIMESTAMP(3),
    "gradedById" UUID,

    CONSTRAINT "LabSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "kicker" TEXT,
    "deck" TEXT,
    "category" "PostCategory",
    "bannerPublicId" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "readTimeMinutes" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "type" "BlockType" NOT NULL,
    "text" TEXT,
    "meta" TEXT,
    "mediaPublicId" TEXT,
    "diagramData" JSONB,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_code_key" ON "Lesson"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizSettings_lessonId_key" ON "QuizSettings"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizAttempt_userId_lessonId_attemptNumber_key" ON "QuizAttempt"("userId", "lessonId", "attemptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Lab_code_key" ON "Lab"("code");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Takeaway" ADD CONSTRAINT "Takeaway_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSettings" ADD CONSTRAINT "QuizSettings_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_quizAttemptId_fkey" FOREIGN KEY ("quizAttemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "Option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lab" ADD CONSTRAINT "Lab_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabSubmission" ADD CONSTRAINT "LabSubmission_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabSubmission" ADD CONSTRAINT "LabSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabSubmission" ADD CONSTRAINT "LabSubmission_gradedById_fkey" FOREIGN KEY ("gradedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
