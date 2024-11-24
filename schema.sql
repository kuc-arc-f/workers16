DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP(3) NULL,
  CompanyName TEXT NOT NULL,
  ContactName TEXT NOT NULL
);

INSERT INTO Customers (CompanyName, ContactName) VALUES ('Alfreds Futterkiste', 'Maria Anders');
INSERT INTO Customers (CompanyName, ContactName) VALUES ('Around the Horn', 'Thomas Hardy');
INSERT INTO Customers (CompanyName, ContactName) VALUES ('Bs Beverages', 'Victoria Ashworth');

---todos
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

---
CREATE TABLE IF NOT EXISTS todo2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  public BOOLEAN NOT NULL DEFAULT false,
  foodOrange BOOLEAN NOT NULL DEFAULT false,
  foodApple BOOLEAN NOT NULL DEFAULT false,
  foodBanana BOOLEAN NOT NULL DEFAULT false,
  pubDate TEXT NOT NULL,
  qty1 TEXT NOT NULL,
  qty2 TEXT NOT NULL,
  qty3 TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

---
CREATE TABLE IF NOT EXISTS todo3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  contentType TEXT,
  age TEXT,
  public BOOLEAN DEFAULT false,
  foodOrange BOOLEAN DEFAULT false,
  foodApple BOOLEAN DEFAULT false,
  foodBanana BOOLEAN DEFAULT false,
  foodMelon BOOLEAN DEFAULT false,
  foodGrape BOOLEAN DEFAULT false,
  datePublish TEXT,
  dateUpdate TEXT,
  postNumber TEXT,
  addressCountry TEXT,
  addressPref TEXT,
  addressCity TEXT,
  address1 TEXT,
  address2 TEXT,
  textOption1 TEXT,
  textOption2 TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
