const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db111.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключение к базе данных SQLite успешно установлено.');
  }
});

function getPartners() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM partners ORDER BY partner_id';
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function createPartner(partner) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO partners (partner_type, partner_name, director_first_name, director_last_name, director_sur_name, email, phone, address_index, address_district, address_town, address_street, address_house, inn, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      partner.type,
      partner.name,
      partner.firstName,
      partner.secondName,
      partner.surName,
      partner.email,
      partner.phone,
      ...partner.address.split(', '),
      '0',
      partner.rating,
    ];

    db.run(query, values, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function updatePartner(partner) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE partners
      SET partner_type = ?,
          partner_name = ?,
          director_first_name = ?,
          director_last_name = ?,
          director_sur_name = ?,
          email = ?,
          phone = ?,
          address_index = ?,
          address_district = ?,
          address_town = ?,
          address_street = ?,
          address_house = ?,
          inn = ?,
          rating = ?
      WHERE partner_id = ?
    `;

    const values = [
      partner.type,
      partner.name,
      partner.firstName,
      partner.secondName,
      partner.surName,
      partner.email,
      partner.phone,
      ...partner.address.split(', '),
      '0',
      partner.rating,
      partner.id,
    ];

    db.run(query, values, function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function deletePartner(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM partners WHERE partner_id = ?';
    db.run(query, [id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
};
