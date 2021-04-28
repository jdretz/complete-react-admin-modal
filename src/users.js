// in src/users.js
import * as React from "react";
import { List, Datagrid, TextField, EmailField, UrlField, useNotify, useCreate } from 'react-admin';
import { withStyles } from '@material-ui/core'
import MuiButton from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Form } from 'react-final-form';
import { Field } from 'react-final-form'
import { useForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import Save from '@material-ui/icons/Save';
import MuiTextField from '@material-ui/core/TextField'

const TextInput = withStyles({
   root: {
       margin: '16px 0px'
   }
})(MuiTextField);

const Button = withStyles({
    root: {
        margin: '16px 0px'
    }
})(MuiButton);

const defaultSubscription = {
    submitting: true,
    pristine: true,
    valid: true,
    invalid: true,
};

export const UserCreateButton = ({ version, onChange }) => {
    const [open, setOpen] = React.useState(false); // Controls modal 

    const [create, { loading }] = useCreate('users'); // Access dataProvider API call
    const notify = useNotify(); // Initialize notify object to send notification to dashboard
    const form = useForm(); // Gains access to the values in the
 
    const handleSubmit = async values => {
        create(
            { payload: { data: values } },
            {
                onSuccess: ({ data }) => {
                    setOpen(false);
                    notify('ra.notification.created', 'info', { smart_count: 1 }); // Default onSuccess function
                    form.change('id', data.id); // Add the new user to the userId reference input.
                    onChange() // Alert the form that something has changed
                },
                onFailure: ({ error }) => {
                    notify('Something went wrong.', 'error');
                }
            }
        );
    };

    return (
        <>
            <Button variant="outlined" color="primary" aria-label="create" onClick={() => setOpen(true)}>
                <AddIcon style={{ marginRight: '4px' }} /> Create User
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Create User with Modal</DialogTitle>
                <DialogContent>
                    <Form
                        onSubmit={handleSubmit}
                        mutators={{ ...arrayMutators }} // necessary for ArrayInput
                        subscription={defaultSubscription} // don't redraw entire form each time one field changes
                        key={version} // support for refresh button
                        keepDirtyOnReinitialize
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit}>
                                <Field name="name">
                                    {props => (
                                        <div>
                                            <TextInput
                                                label={"Name"}
                                                variant="filled"
                                                name={props.input.name}
                                                value={props.input.value}
                                                onChange={props.input.onChange}
                                            />
                                        </div>
                                    )}
                                </Field>
                                <Field name="username" label="Username" >
                                    {props => (
                                        <div>
                                            <TextInput
                                                label={"Username"}
                                                variant="filled"
                                                name={props.input.name}
                                                value={props.input.value}
                                                onChange={props.input.onChange}
                                            />
                                        </div>
                                    )}
                                </Field>
                                <TextField source="id" />
                                <Field name="company.name" label="Company" >
                                    {props => (
                                        <div>
                                            <TextInput
                                                label={"Company"}
                                                variant="filled"
                                                name={props.input.name}
                                                value={props.input.value}
                                                onChange={props.input.onChange}
                                            />
                                        </div>
                                    )}
                                </Field>
                                <Button variant="contained" color="primary" type="submit" disabled={submitting || pristine}>
                                    <Save style={{ marginRight: '8px' }} /> Save
                                </Button>
                            </form>
                        )}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export const UserList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="address.street" />
            <TextField source="phone" />
            <UrlField source="website" />
            <TextField source="company.name" />
        </Datagrid>
    </List>
);