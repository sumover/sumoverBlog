# Host: localhost  (Version 8.0.22)
# Date: 2021-01-17 19:19:52
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

#
# Data for table "article"
#

INSERT INTO `article` VALUES (1,'文章样式测试.','1610874491738','# h1 标题\n## h2 标题\n### h3 标题\n#### h4 标题\n##### h5 标题\n###### h6 标题\n\n\n## 水平线\n\n___\n\n---\n\n***\n\n\n## 文本样式\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n~~Strikethrough~~\n\n\n## 列表\n\n无序\n\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n  - Marker character change forces new list start:\n    * Ac tristique libero volutpat at\n    + Facilisis in pretium nisl aliquet\n    - Nulla volutpat aliquam velit\n+ Very easy!\n\n有序\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\nStart numbering with offset:\n\n57. foo\n1. bar\n\n\n## 代码\n\nInline `code`\n\nIndented code\n\n    // Some comments\n    line 1 of code\n    line 2 of code\n    line 3 of code\n\n\nBlock code \"fences\"\n\n```\nSample text here...\n```\n\nSyntax highlighting\n\n``` js\nvar foo = function (bar) {\n  return bar++;\n};\n\nconsole.log(foo(5));\n```','show',9);

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

#
# Data for table "comment"
#


#
# Structure for table "invitecode"
#

DROP TABLE IF EXISTS `invitecode`;
CREATE TABLE `invitecode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL DEFAULT '',
  `inviteBy` int NOT NULL DEFAULT '0',
  `createDate` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8;

#
# Data for table "invitecode"
#

INSERT INTO `invitecode` VALUES (74,'1',1,'2021-01-17');

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
# Data for table "label"
#

INSERT INTO `label` VALUES (1,'测试');

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

#
# Data for table "user"
#

INSERT INTO `user` VALUES (1,'sumover','6dce86fe1d67cc2d35dec6f4d5eca321','1610873450650','1610882310614','1');

#
# Structure for table "userrole"
#

DROP TABLE IF EXISTS `userrole`;
CREATE TABLE `userrole` (
  `userid` int NOT NULL DEFAULT '0',
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "userrole"
#

INSERT INTO `userrole` VALUES (1,'admin');
