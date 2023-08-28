import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataTable, TextInput } from "react-native-paper";
import moment from "moment";
import MultiSelectDropdown from "./MultiselectDropdown";
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import UpdateRowDialog from "./UpdateRowDialog";

export default function StartPage({ navigation, route }) {

    const { email } = route.params;
    const [amount, setAmount] = React.useState(MIN_PRICE);
    const [row, setRowForDelete] = React.useState(1);
    const [selectedItems, setSelectedItems] = React.useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = React.useState(0);
    const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 5]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        numberOfItemsPerPageList[numberOfItemsPerPageList.length - 1]
    );
    const [isDialogOpen, setDialogOpen] = useState(false);
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, products.length);
    const MIN_PRICE = '1$';

    const DATA_ITEMS = [
        { label: 'Cupcake', value: '1' },
        { label: 'Orange', value: '2' },
        { label: 'Peach', value: '3' },
        { label: 'Sneakers', value: '4' },
        { label: 'Candies', value: '5' },
        { label: 'Eclair', value: '6' },
        { label: 'Apple', value: '7' },
        { label: 'Ice-cream', value: '8' },
    ];

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    React.useEffect(() => {
        productsData();
    }, []);

    const removeValues = async (keys) => {
        try {
            await AsyncStorage.multiRemove(keys)
        } catch (e) {
            // remove error
            console.log('Error:', error)
        }
    }

    const selectItems = (item) => {
        setSelectedItems(item);
    }

    const productsData = async () => {
        await fetch(
            "https://nodejs-mongodb-auth-test-app-f4acf31e7430.herokuapp.com/products", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        ).then((response) => response.json())
            .then(
                (data) => {
                    if (data.result) {
                        setProducts(
                            data.result.map((data, index) => {
                                return {
                                    id: data._id,
                                    items: { key: index, data: data.items },
                                    amount: data.amount,
                                    date: data.date,
                                }
                            }
                            ))
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Error. Can not update table data',
                            visibilityTime: 3000,
                        });
                    }
                },
                () => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        visibilityTime: 3000,
                    });
                })
    };

    const addRow = async () => {
        const newProducts = [];
        DATA_ITEMS.forEach((element) => {
            if (selectedItems.includes(element.value)) {
                newProducts.push(element.label);
            }
        });
        if (newProducts) {
            await fetch(
                'https://nodejs-mongodb-auth-test-app-f4acf31e7430.herokuapp.com/products/add', {
                method: 'POST',
                body: JSON.stringify({ "items": newProducts, "amount": amount || MIN_PRICE }),
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            ).then((response) => response.json())
                .then(
                    () => {
                        Toast.show({
                            type: 'success',
                            text1: `Product was created`,
                            visibilityTime: 3000,
                        });
                        setSelectedItems([]);
                        setAmount(MIN_PRICE)
                        productsData();
                    },
                    () => {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            visibilityTime: 3000,
                        });
                    })
        } else {
            Toast.show({
                type: 'error',
                text1: `Select at least one product`,
                visibilityTime: 3000,
            });
        }
    };

    const deleteRow = async () => {
        const rowDeleted = products[row - 1];
        if (rowDeleted) {
            await fetch(
                `https://nodejs-mongodb-auth-test-app-f4acf31e7430.herokuapp.com/products/delete?id=${rowDeleted.id}`, {
                method: 'Delete',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            ).then((response) => response.json())
                .then(
                    () => {
                        Toast.show({
                            type: 'success',
                            text1: `Row was deleted`,
                            visibilityTime: 3000,
                        });
                        setRowForDelete(1);
                        productsData();
                    },
                    () => {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            visibilityTime: 3000,
                        });
                    })
        } else {
            Toast.show({
                type: 'error',
                text1: `No row with index ${row}`,
                visibilityTime: 3000,
            });
        }
    };

    const logout = async () => {
        await fetch(
            "https://nodejs-mongodb-auth-test-app-f4acf31e7430.herokuapp.com/logout", {
            method: 'PUT',
            body: JSON.stringify({ "email": email }),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        ).then((response) => response.json())
            .then(
                (result) => {
                    removeValues(['token', 'email']);

                    setTimeout(() => navigation.dispatch(StackActions.replace('Login', { email })), 3000);
                },
                () => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        visibilityTime: 3000,
                    });
                })
    };

    const updateRow = async (rowNumber, items, amount) => {
        const uniqueId = products[rowNumber + 1].id;
        const selectedProducts = [];
        DATA_ITEMS.forEach((element) => {
            if (items.includes(element.value)) {
                selectedProducts.push(element.label);
            }
        });
        await fetch(
            `https://nodejs-mongodb-auth-test-app-f4acf31e7430.herokuapp.com/products/update`, {
            method: 'POST',
            body: JSON.stringify({ "id": uniqueId, "items": selectedProducts, "amount": amount || MIN_PRICE }),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json())
            .then(
                (result) => {
                    Toast.show({
                        type: 'success',
                        text1: result.message,
                        visibilityTime: 3000,
                    });
                    productsData();
                },
                () => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        visibilityTime: 3000,
                    });
                })
    };

    const closeDialog = () => {
        setDialogOpen(false);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.actionBlock}>
                <View style={styles.bntContainer}>
                    <MultiSelectDropdown data={DATA_ITEMS} selectItems={selectItems} selectedItems={selectedItems} />
                    <TextInput
                        style={{ ...styles.textInput }}
                        underlineColor="grey"
                        activeOutlineColor="grey"
                        activeUnderlineColor="grey"
                        label="Amount"
                        value={amount}
                        onChangeText={text => setAmount(text)}
                    />
                    <View style={styles.btnWrapper}>
                        <TouchableOpacity onPress={addRow} style={styles.btn}>
                            <Text style={styles.btnText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={deleteRow} style={styles.btn}>
                            <Text style={styles.btnText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setDialogOpen(true)} style={styles.btn}>
                            <Text style={styles.btnText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.bntContainer}>
                    <TextInput
                        style={{ ...styles.textInput }}
                        underlineColor="grey"
                        activeOutlineColor="grey"
                        activeUnderlineColor="grey"
                        label="Row"
                        value={row}
                        onChangeText={text => setRowForDelete(text)}
                    />
                </View>
                <View style={styles.bntContainer}>
                    <TouchableOpacity onPress={logout} style={[styles.btn, styles.btnLogout]}>
                        <Text style={styles.btnText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.tableBlock}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Items</DataTable.Title>
                        <DataTable.Title>Amount</DataTable.Title>
                        <DataTable.Title>Date</DataTable.Title>
                    </DataTable.Header>

                    {products.slice(from, to).map((item, index) => (
                        <DataTable.Row key={item.id + index}>
                            <DataTable.Cell key={item.id + item.items.key}>
                                {
                                    item.items.data.join(', ')
                                }
                            </DataTable.Cell>
                            <DataTable.Cell>{item.amount}</DataTable.Cell>
                            <DataTable.Cell>{
                                moment(item.date).format("MMM Do YYYY")
                            }</DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(products.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${products.length}`}
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>
            </View>
            <UpdateRowDialog
                open={isDialogOpen}
                close={() => closeDialog()}
                update={updateRow}
                minPrice={MIN_PRICE}
                dataItems={DATA_ITEMS}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    actionBlock: {
        width: '100%',
        backgroundColor: 'grey',
        flex: 1,
        justifyContent: "flex-start",
        paddingBottom: 8,
    },
    bntContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: "flex-start",
        paddingLeft: 8,
        paddingRight: 8,
    },
    btnWrapper: {
        display: 'flex',
        flexDirection: 'row',
    },
    btn: {
        width: 100,
        borderRadius: 25,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        marginRight: 8,
        marginLeft: 4,
        backgroundColor: "#61dafb",
    },
    btnLogout: {
        backgroundColor: "red",
    },
    btnText: {
        color: 'white',
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    textInput: {
        marginTop: 8,
        borderRadius: 14,
        borderTopEndRadius: 14,
        borderTopLeftRadius: 14,
        backgroundColor: '#FFFFFF',
    },
});
