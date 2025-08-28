-- CreateTable
CREATE TABLE `audit` (
    `auditID` INTEGER NOT NULL AUTO_INCREMENT,
    `auditIP` VARCHAR(255) NULL,
    `auditURL` VARCHAR(255) NULL,
    `auditURLMethod` VARCHAR(255) NULL,
    `auditURLPayload` VARCHAR(255) NULL,
    `auditCreatedDate` DATETIME(0) NULL,

    PRIMARY KEY (`auditID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `userSecretKey` VARCHAR(255) NULL,
    `userUsername` VARCHAR(255) NULL,
    `userPassword` VARCHAR(255) NULL,
    `userFullName` VARCHAR(255) NULL,
    `userEmail` VARCHAR(255) NULL,
    `userPhone` VARCHAR(255) NULL,
    `userStatus` VARCHAR(255) NULL,
    `userCreatedDate` DATETIME(0) NULL,
    `userModifiedDate` DATETIME(0) NULL,

    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `roleID` INTEGER NOT NULL AUTO_INCREMENT,
    `roleName` VARCHAR(255) NULL,
    `roleDescription` VARCHAR(255) NULL,
    `roleStatus` VARCHAR(255) NULL,
    `roleCreatedDate` DATETIME(0) NULL,
    `roleModifiedDate` DATETIME(0) NULL,

    PRIMARY KEY (`roleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lookup` (
    `lookupID` INTEGER NOT NULL AUTO_INCREMENT,
    `lookupOrder` INTEGER NULL,
    `lookupTitle` VARCHAR(255) NULL,
    `lookupRefCode` VARCHAR(255) NULL,
    `lookupValue` VARCHAR(255) NULL,
    `lookupType` VARCHAR(255) NULL,
    `lookupStatus` VARCHAR(255) NULL,
    `lookupCreatedDate` DATETIME(0) NULL,
    `lookupModifiedDate` DATETIME(0) NULL,

    PRIMARY KEY (`lookupID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userrole` (
    `userRoleID` INTEGER NOT NULL AUTO_INCREMENT,
    `userRoleUserID` INTEGER NOT NULL DEFAULT 0,
    `userRoleRoleID` INTEGER NOT NULL DEFAULT 0,
    `userRoleCreatedDate` DATETIME(0) NOT NULL,

    INDEX `FK_userrole_role`(`userRoleRoleID`),
    INDEX `FK_userrole_user`(`userRoleUserID`),
    PRIMARY KEY (`userRoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userrole` ADD CONSTRAINT `FK_userrole_role` FOREIGN KEY (`userRoleRoleID`) REFERENCES `role`(`roleID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `userrole` ADD CONSTRAINT `FK_userrole_user` FOREIGN KEY (`userRoleUserID`) REFERENCES `user`(`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
