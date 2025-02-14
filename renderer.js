document.addEventListener("DOMContentLoaded", () => {
  loadPartners();
  document
    .getElementById("add-partner")
    .addEventListener("click", () => openModal());
  document
    .getElementById("partner-form")
    .addEventListener("submit", savePartner);
  document.getElementById("close-modal").addEventListener("click", closeModal);
});

async function loadPartners() {
  const partners = await window.electronAPI.getPartners();
  const list = document.getElementById("partner-list");
  list.innerHTML = "";

  partners.forEach((partner) => {
    const item = document.createElement("div");
    item.className = "partner-item";
    item.innerHTML = `
        <div><strong>${partner.partner_name}</strong></div>
        <div>${partner.director_first_name} ${partner.director_last_name}</div>
        <div>Email: ${partner.email}</div>
        <div>Телефон: ${partner.phone}</div>
        <div>Адрес: ${partner.address_index}, ${partner.address_district}, ${partner.address_town}, ${partner.address_street}, ${partner.address_house}</div>
        <div>ИНН: ${partner.inn}</div>
        <div>Рейтинг: ${partner.rating}</div>
        <button onclick="openModal(${partner.partner_id})">Редактировать</button>
        <button onclick="deletePartner(${partner.partner_id})">Удалить</button>
      `;
    list.appendChild(item);
  });
}

async function openModal(id = null) {
  const modal = document.getElementById("edit-modal");
  modal.style.display = "flex";

  if (id) {
    const partners = await window.electronAPI.getPartners();
    const partner = partners.find((p) => p.partner_id === id);

    document.getElementById("modal-title").innerText =
      "Редактирование партнёра";
    document.getElementById("partner-id").value = partner.partner_id;
    document.getElementById("partner-type").value = partner.partner_type;
    document.getElementById("partner-name").value = partner.partner_name;
    document.getElementById("director-first-name").value =
      partner.director_first_name;
    document.getElementById("director-last-name").value =
      partner.director_last_name;
    document.getElementById("director-sur-name").value =
      partner.director_sur_name;
    document.getElementById("email").value = partner.email;
    document.getElementById("phone").value = partner.phone;
    document.getElementById(
      "address"
    ).value = `${partner.address_index}, ${partner.address_district}, ${partner.address_town}, ${partner.address_street}, ${partner.address_house}`;
    document.getElementById("inn").value = partner.inn;
    document.getElementById("rating").value = partner.rating;
  } else {
    document.getElementById("modal-title").innerText = "Добавление партнёра";
    document.getElementById("partner-id").value = "";
    document.getElementById("partner-form").reset();
  }
}

async function savePartner(event) {
  event.preventDefault();

  const partnerId = document.getElementById("partner-id").value.trim();
  const partner = {
    type: document.getElementById("partner-type").value,
    name: document.getElementById("partner-name").value,
    firstName: document.getElementById("director-first-name").value,
    secondName: document.getElementById("director-last-name").value,
    surName: document.getElementById("director-sur-name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address_index: document.getElementById("address-index").value,
    address_district: document.getElementById("address-district").value,
    address_town: document.getElementById("address-town").value,
    address_street: document.getElementById("address-street").value,
    address_house: document.getElementById("address-house").value,
    inn: document.getElementById("inn").value,
    rating: document.getElementById("rating").value,
  };

  if (partnerId) {
    partner.id = partnerId;
    await window.electronAPI.updatePartner(partner);
  } else {
    await window.electronAPI.createPartner(partner);
  }

  closeModal();
  loadPartners();
}

async function deletePartner(id) {
  await window.electronAPI.deletePartner(id);
  loadPartners();
}

function closeModal() {
  document.getElementById("edit-modal").style.display = "none";
}
