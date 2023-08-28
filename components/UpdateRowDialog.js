import React, { useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogActions,
    Button,
} from "@react-native-material/core";
import { TextInput } from "react-native-paper";
import MultiSelectDropdown from "./MultiselectDropdown";
import { StyleSheet } from "react-native";

const UpdateRowDialog = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [row, setRow] = React.useState(0);
    const [amount, setAmount] = React.useState(props.minPrice);
    const [selectedItems, setSelectedItems] = React.useState([]);

    const close = () => {
        setAmount(props.minPrice);
        setSelectedItems([]);
        props.close();
    }

    const update = () => {
        setIsLoading(true);
        props.update(row, selectedItems, amount).finally(
            () => {
                setIsLoading(false);
                close();
            }
        );
    }

    const selectItems = (item) => {
        setSelectedItems(item);
        console.log(item);
    }

    return (
        <Dialog visible={props.open} onDismiss={close}>
            <DialogHeader title="Update row" />
            <DialogContent>
                <MultiSelectDropdown data={props.dataItems} selectItems={selectItems} selectedItems={selectedItems} />
                <TextInput
                    style={{ ...styles.textInput }}
                    underlineColor="grey"
                    activeOutlineColor="red"
                    activeUnderlineColor="red"
                    label="Amount"
                    value={amount}
                    onChangeText={text => setAmount(text)}
                />
                <TextInput
                    style={{ ...styles.textInput }}
                    underlineColor="grey"
                    activeOutlineColor="red"
                    activeUnderlineColor="red"
                    label="Row Number"
                    value={row}
                    onChangeText={text => setRow(text)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    style={styles.btn}
                    title="Cancel"
                    compact
                    variant="text"
                    onPress={close}
                />
                <Button
                    style={styles.btn}
                    title="Update"
                    compact
                    variant="text"
                    onPress={update}
                    loading={isLoading}
                />
            </DialogActions>
        </Dialog>
    );
};

const styles = StyleSheet.create({
    btn: {
        minWidth: 80,
    },
    textInput: {
        marginTop: 8,
        borderRadius: 14,
        borderTopEndRadius: 14,
        borderTopLeftRadius: 14,
        backgroundColor: '#FFFFFF',
    },
});

export default UpdateRowDialog;