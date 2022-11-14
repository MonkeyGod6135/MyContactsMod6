import React, { useState } from 'react';
import {Text, TextInput, View, Pressable, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
// import openDatabase hook
import { openDatabase } from "react-native-sqlite-storage";

// use hook to create database
const myContactsDB = openDatabase({name: 'MyContacts.db'});
const contactsTableName = 'contacts';
const contactGroupsTableName = 'contact_groups';

const ExistingContactScreen= props => {

    const post = props.route.params.post;

    const [fullname, setFullName] = useState(post.fullname);
    const [phone, setPhone] = useState(post.phone);
    const [email, setEmail] = useState(post.email);

    const navigation = useNavigation();

    const onListUpdate = () => {
        if (!fullname){
            alert('Please enter a fullname list name.');
            return;
        }
        if (!phone){
            alert('Please enter a phone numner in format xxx-xxx-xxxx.');
            return;
        }
        if (!email){
            alert('Please enter a email address');
            return;
        }

        myContactsDB.transaction(txn => {
            txn.executeSql(
                `UPDATE ${contactsTableName} SET fullname = '${fullname}', phone = '${phone}', email = '${email}' WHERE id = ${post.id}`,
                [],
                () => {
                    console.log(`${fullname} updated successfully`);
                },
                error => {
                    console.log('Error on updating contact' + error.message);
                }
            );
        });

        alert(fullname + ' updated!');
        navigation.navigate('Go To Contacts!');
    }

    const onListDelete = () => {
        return Alert.alert(
            // title
            'Confirm',
            // message
            'Are you sure you want to delete this Contact?',
            // buttons
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        myContactsDB.transaction(txn => {
                            txn.executeSql(
                                `DELETE FROM ${contactsTableName} WHERE id = ${post.id}`,
                                [],
                                () => {
                                    console.log(`${fullname} deleted successfully`);
                                },
                                error => {
                                    console.log('Error on deleting contact' + error.message);
                                }
                            );
                        });
                        myContactsDB.transaction(txn => {
                            txn.executeSql(
                                `DELETE FROM ${contactGroupsTableName} WHERE id = ${post.id}`,
                                [],
                                () => {
                                    console.log('Contact group deleted successfully');
                                },
                                error => {
                                    console.log('Error on deleting contact from group' + error.message);
                                }
                            );
                        });
                        alert('List Deleted!');
                        navigation.navigate('Go To Contacts!');
                    },
                },
                {
                    text: 'No',
                },
            ],
        );
    }

    const onAddGroup = () => {
        navigation.navigate('Add Contact Group', {post:post});
        
    }


  return (
    <View style={styles.container}>
        <View style={styles.topContainer}>
            <TextInput 
                value={fullname}
                onChangeText={value => setFullName(value)}
                style={styles.fullname}
                clearButtonMode={'while-editing'}
                placeholder={'Enter Contact FullName'}
                placeholderTextColor={'grey'}
            />
            <TextInput 
                value={phone}
                onChangeText={value => setPhone(value)}
                style={styles.phone}
                clearButtonMode={'while-editing'}
                placeholder={'Please enter a phone numner in format xxx-xxx-xxxx.'}
                placeholderTextColor={'grey'}
            />
            <TextInput 
                value={email}
                onChangeText={value => setEmail(value)}
                style={styles.email}
                clearButtonMode={'while-editing'}
                placeholder={'Enter a email address'}
                placeholderTextColor={'grey'}
            />
        </View>
        <View style={styles.bottomContainer}>
            <Pressable style={styles.updateButton} onPress={onListUpdate}>
                <Text style={styles.buttonText}>Update</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={onListDelete}>
                <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
            <Pressable style={styles.addButton} onPress={onAddGroup}>
                <Text style={styles.buttonText}>Add Group</Text>
            </Pressable>
        </View>
    </View>
  );
};

export default ExistingContactScreen;