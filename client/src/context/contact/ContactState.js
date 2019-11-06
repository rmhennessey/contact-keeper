import React, { useReducer } from 'react';
import uuid from 'uuid';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    CLEAR_FILTER
} from '../types'

const ContactState = props => {
    const initialState = {
        contacts: [
            {
                id: 1,
                name: 'Herm the Worm',
                email: 'herm@gmail.com',
                phone: '555-555-5555',
                type: 'personal'
            },
            {
                id: 2,
                name: 'Herm the Germ',
                email: 'germ@gmail.com',
                phone: '555-555-5555',
                type: 'personal'
            },
            {
                id: 3,
                name: 'Herm the Perm',
                email: 'perm@gmail.com',
                phone: '555-555-5555',
                type: 'personal'
            }
        ],
        current: null,
        filtered: null
    }

    const [state, dispatch] = useReducer(contactReducer, initialState);

    // Add Contact
    const addContact = contact => {
        contact.id = uuid.v4();
        dispatch({ type: ADD_CONTACT, payload: contact });
    }

    // Delete Contact
    const deleteContact = id => {
        dispatch({ type: DELETE_CONTACT, payload: id });
    }

    // Set Current Contact
    const setCurrent = contact => {
        dispatch({ type: SET_CURRENT, payload: contact });
    }

    // Clear Current Contact
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT });
    }

    // Update Contact
    const updateContact = contact => {
        dispatch({ type: UPDATE_CONTACT, payload: contact });
    }

    // Filter Contacts
    const filterContacts = text => {
        dispatch({ type: FILTER_CONTACTS, payload: text });
    }

    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    }

    return (
        <ContactContext.Provider
            value={{
                contacts: state.contacts,
                current: state.current,
                filtered: state.filtered,
                addContact,
                deleteContact,
                setCurrent,
                clearCurrent,
                updateContact,
                filterContacts,
                clearFilter
            }}
        >
            {props.children}
        </ContactContext.Provider>
    )
}

export default ContactState;