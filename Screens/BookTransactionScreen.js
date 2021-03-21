import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import * as Permissions from  'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../Config'


export default class BookTransactionScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            hasCameraPermissions : null,
            scanned : false,
            buttonState : "normal",
            scannedBookId : '',
            scannedStudentId : '',
            transactionMessage : ""
        }
    }

    getCameraPermissions = async (id) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);

        this.setState({
            /*
            status === "granted" is true when user has granted permission
            status === "granted" is false when user has not granted permission
            */
            hasCameraPermissions : status === "granted",
            buttonState : id,
            scanned : false
        })
    }

    handleBarCodeScanned = async({type,data}) => {
        const {buttonState} = this.state;

        if(buttonState === "BookId")
        {
            this.setState({
                scanned : true,
                scannedBookId : data,
                buttonState : "normal"
            })
        }
        else if(buttonState === "StudentId")
        {
            this.setState({
                scanned : true,
                scannedStudentId : data,
                buttonState : "normal"
            })
        }

        
    }

    initiateBookIssue = async () => {
        //adding a transaction
        db.collection("Transactions").add({
            'StudentId' : this.state.scannedStudentId,
            'BookId' : this.state.scannedBookId,
            'Date' : firebase.firestore.Timestamp.now().toDate(),
            'TransactionType' : "Issue"
        })

        //changing book status
        db.collection("Books").doc(this.state.scannedBookId).update({
            'BookAvailiability' : false
        })

        //change the number of books issued to the student
        db.collection("Students").doc(this.state.scannedStudentId).update({
            'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(1)
        })
        alert("Book Issued...!")

        this.setState({
            scannedBookId : '',
            scannedStudentId : ''
        })
    }

    initiateBookReturn = async () => {
        //adding a transaction
        db.collection("Transactions").add({
            'StudentId' : this.state.scannedStudentId,
            'BookId' : this.state.scannedBookId,
            'Date' : firebase.firestore.Timestamp.now().toDate(),
            'TransactionType' : "Return"
        })

        //changing book status
        db.collection("Books").doc(this.state.scannedBookId).update({
            'BookAvailiability' : true
        })

        //change the number of books issued to the student
        db.collection("Students").doc(this.state.scannedStudentId).update({
            'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(-1)
        })
        alert("Book Returned...!")

        this.setState({
            scannedBookId : '',
            scannedStudentId : ''
        })
    }

    handleTransaction = () => {
        var transactionMessage = null;
        db.collection("Books").doc(this.state.scannedBookId).get()
        .then((doc)=>{
            var book = doc.data()
            if(book.BookAvailiability){
                this.initiateBookIssue();
                transactionMessage = "Book Issued"
            }
            else {
                this.initiateBookReturn();
                transactionMessage = "Book Returned"
            }
        })
        this.setState({
            transactionMessage : transactionMessage
        })
    }

    render()
    {
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;

        if(buttonState !== "normal" && hasCameraPermissions){
            return (
                <BarCodeScanner
                onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScanned}
                style = {StyleSheet.absoluteFillObject}
                />
            )
        }
        else if (buttonState === "normal"){
            return(
                <View style = {styles.container}>
                    <View>
                    <Image
                    source = {require('../assets/logo.png')}
                    style  = {styles.image}/>
                    </View>
                    <View style = {styles.inputView}>
                        <TextInput
                        style = {styles.inputBox}
                        placeholder = "Book Id"
                        value = {this.state.scannedBookId}
                        />
                        <TouchableOpacity 
                        style = {styles.scanButton}
                        onPress = {() =>{
                            this.getCameraPermissions("BookId")
                        }} >
                            <Text style = {styles.buttonText}>Scan QR code</Text>
                        </TouchableOpacity>
                    </View>
                    <View style = {styles.inputView}>
                        <TextInput
                        style = {styles.inputBox}
                        placeholder = "Student Id"
                        value = {this.state.scannedStudentId}
                        />
                        <TouchableOpacity 
                        style = {styles.scanButton}
                        onPress = {() =>{
                            this.getCameraPermissions("StudentId")
                        }}>
                            <Text style = {styles.buttonText}>Scan QR code</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity 
                        style = {styles.submitButton}
                        onPress = {async () => {this.handleTransaction()}}>
                            <Text style = {styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        
    }
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent  :"center",
        alignItems : "center"
    },
    scanButton : {
        backgroundColor : "green",
        width : 90
    },
    buttonText : {
        fontSize : 15,
        fontWeight : "bold",
        color : "white",
        textAlign : "center",
        

    },
    inputView : {
        flexDirection : "row",
        margin : 20
    },
    inputBox : {
        width : 200,
        height : 40, 
        borderWidth : 1.5,
        fontSize : 20
    },
    image : {
        height : 200,
        width : 200
    },
    submitButton : {
        backgroundColor : "red",
        width : 100,
        height : 40,
        alignItems : "center",
        justifyContent : "center"
    }
})