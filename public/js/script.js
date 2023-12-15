const APIURL = "https://api-dishes.vercel.app/";

const viewDishDataButton = document.getElementById("dishDataButton");
const idInput = document.getElementById("id");
const nombreInput = document.getElementById("nombre");
const descripcionInput = document.getElementById("descripcion");
const precioInput = document.getElementById("precio");
const caloriasInput = document.getElementById("calorias");
const vegetarianoSelect = document.getElementById("vegetariano");
const newDishButton = document.getElementById("newDishDataButton");
const deleteDish = document.getElementById("deleteDishBtn");
const newDish = document.getElementById("newDishBtn");
const closeDishDataModal = document.getElementById("closeDishDataModal");

const isVegetarian = (state) => {
  const trueItem = `<div class="badge bg-success text-wrap" style="width: 6rem;">Vegetariano</div>`;
  const falseItem = `<div class="badge bg-dark text-wrap" style="width: 6rem;">No vegetariano</div>`;
  return state ? trueItem : falseItem;
};

const setDataInTable = (dish) => {
  tableBody.innerHTML += generateTableRow(dish);
};

const clearTable = () => {
    tableBody.innerHTML = "";
}

const hasComments = (comments) => {
  return comments !== "" ? comments : "Sin descripción";
};

const findDish = (id) => {
  return new Promise((res, rej) => {
    fetch(APIURL + `${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Fallo en la pericion, error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        res(data);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

const showModal = () => {
    viewDishDataButton.click();
}

const getFormData = () => {
    return {
        idDish: idInput.value,
        name: nombreInput.value,
        comments: descripcionInput.value ,
        value: precioInput.value,
        calories: caloriasInput.value,
        isVegetarian: vegetarianoSelect.value === "si" ? true : false
    }
}

const showInDataModal = (dish) => {
    idInput.value = dish.idDish;
    nombreInput.value = dish.name;
    descripcionInput.value = hasComments(dish.comments);
    precioInput.value = dish.value;
    caloriasInput.value = dish.calories;
    vegetarianoSelect.value = dish.isVegetarian ? "si": "no";
};

const clearInputs = () => {
    idInput.value = null;
    nombreInput.value = null;
    descripcionInput.value = null;
    precioInput.value = null;
    caloriasInput.value = null;
    vegetarianoSelect.value =  "no";
};

const disableInputs = () => {
    idInput.disabled = true;
    nombreInput.disabled = true;
    descripcionInput.disabled = true;
    precioInput.disabled = true;
    caloriasInput.disabled = true;
    vegetarianoSelect.disabled = true;
}

const enableInputs = () => {
    idInput.disabled = false;
    nombreInput.disabled = false;
    descripcionInput.disabled = false;
    precioInput.disabled = false;
    caloriasInput.disabled = false;
    vegetarianoSelect.disabled = false;
}

const closeModal= () => {
    closeDishDataModal.click();
}

const hideSaveButton = () => {
    newDish.style.display = "none";
}

const showSaveButton = () => {
    newDish.style.display = "block";
}

const rowEventListener = (id) => {
  findDish(id).then((res) => {
    disableInputs();
    showInDataModal(res.data);
    showModal();
    hideSaveButton();
  }).catch(err => {
    alert("No se ha podido obtener la informacion del plato")
  });
};

const getViewButton = (dish) =>{
    return `<button type="button" id="button-${dish._id}" onclick="rowEventListener('${dish._id}')" class="btn btn-success">Ver</button>`;
}

const getDeleteButton = (dish) =>{
    return `<button type="button" id="button-${dish._id}" onclick="deleteEvent('${dish._id}')" class="btn btn-danger">Eliminar</button>`;
}

const generateTableRow = (dish) => {
  return `<tr id="row-${
    dish._id
  }" style="cursor: pointer;">
        <th scope="row">${dish.idDish}</th> 
        <td>${dish.name}</td> 
        <td>${hasComments(dish.comments)}</td>
        <td>${dish.value}</td>
        <td>${dish.calories}</td>
        <td>${isVegetarian(dish.isVegetarian)}</td>
        <td>${getViewButton(dish)}</td>
        <td>${getDeleteButton(dish)}</td>
    </tr>`;
};

const mapDishes = (dishes) => {
  dishes.forEach((dish) => {
    setDataInTable(dish);
  });
};

const saveDish = (dish) => {
    return new Promise((resolve, reject) => {
        fetch(APIURL,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dish)
        }).then((res) => {
            if (!res.ok) {
              throw new Error(`Fallo en la pericion, error: ${res.status}`);
            }
            console.log(res.status);
            if(res.status === 208){
                return reject(res);
            }
            return res.json();
          })
          .then((data) => {
            resolve(data.data);
          })
          .catch((err) => {
            reject(err);
          });
    })
}

newDishButton.addEventListener("click", () => {
    enableInputs();
    showSaveButton();
    clearInputs();
    showModal();
})

const deleteDishFunction = (id) => {
    return new Promise((resolve, reject) => {
        fetch(APIURL + id,{
            method: "DELETE",
        }).then((res) => {
            if (!res.ok) {
              throw new Error(`Fallo en la pericion, error: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            if(data.state){
                resolve(data.data);
            } else {
                reject(data.data)
            }
          })
          .catch((err) => {
            reject(err);
          });
    })
}

const deleteEvent = (id) => {
    deleteDishFunction(id).then(res => {
        alert("El plato fue eliminado exitosamente")
        reloadData();
    }).catch(err => {
        alert("Error al eliminar el plato");
    })
}

const reloadData = () => {
    closeModal();
    clearTable();
    loadData();
}

newDish.addEventListener("click", () => {
    const dish = getFormData();
    saveDish(dish).then(res => {
        alert("Plato guardado con exito")
        reloadData();
    }).catch(err => {
        err.json().then(res => {
            alert(res.data)
        })
    })
})

const loadData = () => {
  fetch(APIURL)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Fallo en la pericion, error: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      mapDishes(data.data);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
    });
};

loadData();
