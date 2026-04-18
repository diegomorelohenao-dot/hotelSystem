function hotelSystem(rooms) {
  let reservations = [];

  function parseDate(date) {
    const [day, month] = date.split("/").map(Number);
    return month * 31 + day;
  }

  function isOverlap(r1, r2) {
    return (
      parseDate(r1.checkIn) < parseDate(r2.checkOut) &&
      parseDate(r2.checkIn) < parseDate(r1.checkOut)
    );
  }

  return {
    searchReservation(id) {
      const res = reservations.find((r) => r.id === id);
      if (!res) throw new Error("La reservación no fue encontrada");
      return res;
    },

    getSortReservations() {
      return [...reservations].sort(
        (a, b) => parseDate(a.checkIn) - parseDate(b.checkIn),
      );
    },

    addReservation(reservation) {
      const occupied = reservations.some(
        (r) =>
          r.roomNumber === reservation.roomNumber && isOverlap(r, reservation),
      );

      if (occupied) {
        throw new Error("La habitación no está disponible");
      }

      reservations.push(reservation);
      return reservation;
    },

    removeReservation(id) {
      const index = reservations.findIndex((r) => r.id === id);

      if (index === -1) {
        throw new Error("La reservación que se busca remover no existe");
      }

      return reservations.splice(index, 1)[0];
    },

    getReservations() {
      return reservations;
    },

    getAvailableRooms(checkIn, checkOut) {
      const requested = { checkIn, checkOut };

      let available = [];

      for (let i = 1; i <= rooms; i++) {
        const ocupado = reservations.some(
          (r) => r.roomNumber === i && isOverlap(r, requested),
        );

        if (!ocupado) available.push(i);
      }

      return available;
    },
  };
}

// MENÚ
function iniciarMenu() {
  const hotel = hotelSystem(10);

  let option;

  do {
    option = prompt(
      "🏨 HOTEL SYSTEM\n" +
        "1. Agregar reservación\n" +
        "2. Buscar reservación\n" +
        "3. Eliminar reservación\n" +
        "4. Ver reservaciones\n" +
        "5. Ver habitaciones disponibles\n" +
        "6. Ordenar reservaciones\n" +
        "0. Salir",
    );

    try {
      switch (option) {
        case "1":
          const reservation = {
            id: prompt("ID:"),
            name: prompt("Nombre:"), //El nombre de quien agenda
            checkIn: prompt("Check-in (dd/mm):"),
            checkOut: prompt("Check-out (dd/mm):"),
            roomNumber: Number(prompt("Habitación:")),
          };
          hotel.addReservation(reservation);
          alert("✅ Reservación agregada");
          break;

        case "2":
          const idSearch = prompt("ID:");
          alert(JSON.stringify(hotel.searchReservation(idSearch), null, 2));
          break;

        case "3":
          const idDelete = prompt("ID:");
          hotel.removeReservation(idDelete);
          alert("❌ Reservación eliminada");
          break;

        case "4":
          alert(JSON.stringify(hotel.getReservations(), null, 2));
          break;

        case "5":
          const checkIn = prompt("Check-in:");
          const checkOut = prompt("Check-out:");
          alert("Disponibles: " + hotel.getAvailableRooms(checkIn, checkOut));
          break;

        case "6":
          alert(JSON.stringify(hotel.getSortReservations(), null, 2));
          break;
      }
    } catch (error) {
      alert("⚠️ " + error.message);
    }
  } while (option !== "0");
}

// Ejecutar automáticamente
iniciarMenu();
