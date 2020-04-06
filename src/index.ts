run();

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

type Contacts = Contact[];

// The entire app is in a function just to make sure we don't polute the global namespace
function run() {
  const rootEl = getElementByIdOrThrow("root");

  // The list of contacts
  let contacts: Contacts = [
    {
      id: "p9n51g",
      name: "Alice",
      email: null,
      phone: "02345678",
    },
    {
      id: "8mopn7",
      name: "Bob",
      email: "bob@gmail.com",
      phone: null,
    },
    {
      id: "u7oo0d",
      name: "Paul",
      email: "paul@gmail.com",
      phone: null,
    },
  ];

  // Call createApp to initialize the App
  // and get the contactsEl used for updates
  const { contactsEl } = createApp();

  // Make sure the App is updated at when stating
  renderApp();

  // This function create the HTML structure
  // and add it to the root element in the DOM
  function createApp(): { contactsEl: HTMLElement } {
    const titleEl: HTMLElement = createElement("h1", {
      children: "Contacts",
      className: "title",
    });

    const contactsEl: HTMLElement = createElement("div", {
      className: "contacts",
    });

    const { addFormEl } = createAddForm();

    const appEl: HTMLElement = createElement("div", {
      className: "app",
      children: [titleEl, contactsEl, addFormEl],
    });

    rootEl.appendChild(appEl);

    return {
      contactsEl,
    };
  }

  // Create the add form structure
  function createAddForm(): { addFormEl: HTMLElement } {
    // on peut caster en HTMLInputElement mais autant mettre any car de toute facon c'ets un cast forcé et il faudrait plutôt revoir createElement
    // const inputNameEl: HTMLInputElement = <HTMLInputElement>(
    //   createElement("input")
    // );
    const inputNameEl: HTMLInputElement = createElement(
      "input"
    ) as HTMLInputElement;
    inputNameEl.placeholder = "name";

    const inputEmailEl: HTMLInputElement = createElement("input") as any;
    inputEmailEl.placeholder = "email";

    const inputPhoneEl: HTMLInputElement = createElement("input") as any;
    inputPhoneEl.placeholder = "phone";

    const addButtonEl: HTMLElement = createElement("button", {
      children: "Add",
    });

    const onAddClick = (): void => {
      if (inputNameEl.value.length === 0) {
        // no name, return to stop the function
        return;
      }
      // add a contact
      contacts.push({
        id: randomShortId(),
        name: inputNameEl.value,
        email: inputEmailEl.value.length > 0 ? inputEmailEl.value : null,
        phone: inputPhoneEl.value.length > 0 ? inputPhoneEl.value : null,
      });

      // then update the app
      renderApp();

      // and clear the inputs
      inputNameEl.value = "";
      inputEmailEl.value = "";
      inputPhoneEl.value = "";
    };

    addButtonEl.addEventListener("click", onAddClick);
    const addFormEl: HTMLElement = createElement("div", {
      className: "add",
      children: [inputNameEl, inputEmailEl, inputPhoneEl, addButtonEl],
    });
    return { addFormEl };
  }

  // This function is used to update the App, mainly the list of contacts
  function renderApp() {
    renderContacts();
  }

  // This function update the list of contacts
  function renderContacts() {
    // clear the content of the container first
    contactsEl.innerHTML = "";

    // the create new elements
    const contactItemEls = contacts.map((contact) => {
      const deleteEl = createElement("button", {
        className: "remove",
        children: "Delete",
      });

      deleteEl.addEventListener("click", () => {
        // remove the contact
        contacts = contacts.filter((c) => c.id !== contact.id);
        // and update the app
        renderApp();
      });

      return createElement("div", {
        className: "contact",
        children: [
          createElement("div", {
            className: "infos",
            children: [
              createElement("h2", { children: contact.name }),
              contact.email === null
                ? null
                : createElement("p", { children: contact.email }),
              contact.phone === null
                ? null
                : createElement("p", { children: contact.phone }),
            ],
          }),
          deleteEl,
        ],
      });
    });

    // and add them to the container
    contactItemEls.forEach((elem) => {
      contactsEl.appendChild(elem);
    });
  }
}

/**
 * This function let you create an HTML element and add attributes and children
 */

// methode 1
type ChildrenItem = string | HTMLElement | null;

interface PropsOption {
  className?: string;
  children?: ChildrenItem | ChildrenItem[];
}

// ou methode 2
// interface PropsOption {
//   className?: string;
//   children?: string | Array<string | HTMLElement | null>;
// }

function createElement(
  type: string,
  props: PropsOption = {}
): HTMLElement | HTMLInputElement {
  // function createElement(type, props = {}) {
  const elem = document.createElement(type);
  if (props.className) {
    elem.className = props.className;
  }
  if (props.children) {
    const childrenArray = Array.isArray(props.children)
      ? props.children
      : [props.children];
    childrenArray
      // pas nécessaire de typer le map mais si on veut le faire alors on a la ligne ci-dessous
      // .map((children: ChildrenItem): Text | null | HTMLElement => {
      .map((children) => {
        if (typeof children === "string") {
          return document.createTextNode(children);
        }
        return children;
      })
      .forEach((item) => {
        if (item) {
          elem.appendChild(item);
        }
      });
  }
  return elem;
}
/**
 * Like document.getElementById but throw an error
 * if the element does not exist
 */
function getElementByIdOrThrow(id: string): HTMLElement {
  const elem: HTMLElement | null = document.getElementById(id);
  if (!elem) {
    throw new Error(`Cannot find element with id "${id}"`);
  }
  return elem;
}

// console.log("test");
// const a = getElementByIdOrThrow("ttt");
// console.log(a);
// function getThrow(id: string): string {
//   if (id.length) {
//     return id;
//   }
// }

// const a = getThrow("2");

/**
 * Return a short (5 chars) string ID
 */
function randomShortId(): string {
  return Math.random().toString(36).substring(7);
}

interface Square {
  width: number;
  height: number;
}
interface Circle {
  radius: number;
}

const drawShape = (shape: Square | Circle) => {
  if ("width" in shape) {
    console.log("Square : " + shape.width);
  }
  if ("radius" in shape) {
    // comme il sait que radius n'existe que dans  Circle il en déduit que c'est un circle et ne propose que les propriétés de circle
    // attention si c'est une propriété commune à plusieurs interfaces
    console.log("Circle : " + shape.radius);
  }
};

const square: Square = { width: 2, height: 3 };
const circle: Circle = { radius: 4 };
drawShape(circle);
drawShape(square);
