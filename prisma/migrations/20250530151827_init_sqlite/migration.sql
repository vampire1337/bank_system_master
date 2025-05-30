-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
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
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CreditRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "amount" REAL NOT NULL,
    "term" INTEGER NOT NULL,
    "interestRate" REAL NOT NULL,
    "monthlyPayment" REAL,
    "totalPayment" REAL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "birthDate" DATETIME NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "passportIssuedBy" TEXT NOT NULL,
    "passportIssuedDate" DATETIME NOT NULL,
    "passportRegistration" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "employerName" TEXT,
    "jobTitle" TEXT,
    "workExperience" INTEGER,
    "monthlyIncome" REAL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "hasInsurance" BOOLEAN NOT NULL DEFAULT false,
    "insuranceProgramId" TEXT,
    "scoringResult" INTEGER,
    "scoringPassed" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CreditRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreditRequest_insuranceProgramId_fkey" FOREIGN KEY ("insuranceProgramId") REFERENCES "InsuranceProgram" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InsuranceProgram" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coveragePercent" REAL NOT NULL,
    "cost" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CreditParameters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "minAmount" REAL NOT NULL,
    "maxAmount" REAL NOT NULL,
    "minTerm" INTEGER NOT NULL,
    "maxTerm" INTEGER NOT NULL,
    "baseRate" REAL NOT NULL,
    "minRate" REAL NOT NULL,
    "maxRate" REAL NOT NULL,
    "scoringThreshold" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CalculatorHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "amount" REAL NOT NULL,
    "term" INTEGER NOT NULL,
    "interestRate" REAL NOT NULL,
    "monthlyPayment" REAL NOT NULL,
    "totalPayment" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CalculatorHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Statistics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalRequests" INTEGER NOT NULL DEFAULT 0,
    "approvedRequests" INTEGER NOT NULL DEFAULT 0,
    "rejectedRequests" INTEGER NOT NULL DEFAULT 0,
    "issuedRequests" INTEGER NOT NULL DEFAULT 0,
    "canceledRequests" INTEGER NOT NULL DEFAULT 0,
    "averageAmount" REAL,
    "averageTerm" REAL,
    "averageRate" REAL,
    "totalAmountIssued" REAL NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
