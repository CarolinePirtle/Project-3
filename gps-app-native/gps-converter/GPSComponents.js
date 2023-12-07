import { useState } from 'react';
import { StyleSheet, Text, View, Image, Button, TextInput, FlatList } from 'react-native';
export default function ConverterFunc() {
    return(
        <View style = {styles.container}>
        <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1
        }}
        defaultValue="You can type in me"
      />
       <Button title='Convert' 
           onPress={UTC2gps} />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });