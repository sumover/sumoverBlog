# Host: localhost  (Version 8.0.22)
# Date: 2021-01-14 13:56:32
# Generator: MySQL-Front 6.0  (Build 2.20)


#
# Structure for table "article"
#

DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `createTime` varchar(255) DEFAULT NULL,
  `articleDetail` text,
  `showStatus` varchar(255) DEFAULT 'show',
  `readCount` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

#
# Structure for table "comment"
#

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `articleId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `content` text,
  `publishedTime` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

#
# Structure for table "invitecode"
#

DROP TABLE IF EXISTS `invitecode`;
CREATE TABLE `invitecode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL DEFAULT '',
  `inviteBy` int NOT NULL DEFAULT '0',
  `createDate` date DEFAULT '0000-00-00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8;

#
# Structure for table "label"
#

DROP TABLE IF EXISTS `label`;
CREATE TABLE `label` (
  `articleId` int NOT NULL DEFAULT '0',
  `labelInfo` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`articleId`,`labelInfo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "user"
#

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `register_time` varchar(20) NOT NULL DEFAULT '0',
  `last_login_time` varchar(20) NOT NULL DEFAULT '0',
  `invitecode` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

#
# Structure for table "userrole"
#

DROP TABLE IF EXISTS `userrole`;
CREATE TABLE `userrole` (
  `userid` int NOT NULL DEFAULT '0',
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
