import { Outlet, NavLink, Link, useLoaderData, useNavigation, Form, redirect } from "react-router-dom";
import { createContact, getContacts } from "../contacts";
import { useEffect } from "react";


export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`)
}

export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("g");
    const contacts = await getContacts(q);
    return { contacts, q };
}

export default function Root() {
    const { contacts, q } = useLoaderData();
    const navigation = useNavigation();

    const searching = navigation.location &&
        new URLSearchParams(navigation.location.search)
        .has("q")

    useEffect(() => {
        document.getElementById("q").value = q;
    }, [q])
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
                          name="q"
                          defaultValue={q}
                          className={searching ? "loading" : ""}

                          onChange={(e) => {
                              const isFirstSearch = q === null;
                              SubmitEvent(e.currentTarget.form, {
                                  replace: !isFirstSearch
                              })
                          }}
            />
                      <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li>
                      <NavLink to={`contacts/${contact.id}`}
                          className={({ isActive, isPending }) =>
                              isActive ? "active" : isPending ? "pending" : ""}>
                    
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No such name</i>
                    )}
                    {contact.favorite && <span>★</span>}
                    
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>There is no contacts</i>
            </p>
          )}
        </nav>
          </div>
          <div id="detail" className={navigation.state === "loading" ? "loading" : ""}><Outlet /></div>
    </>
  );
}
