-- CreateTable
CREATE TABLE `Apps` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Apps_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chats` (
    `id` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `appId` VARCHAR(191) NOT NULL,
    `numberWithId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Chats_numberWithId_key`(`numberWithId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Messages` (
    `id` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `chatId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chats` ADD CONSTRAINT `Chats_appId_fkey` FOREIGN KEY (`appId`) REFERENCES `Apps`(`token`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chats`(`numberWithId`) ON DELETE RESTRICT ON UPDATE CASCADE;
