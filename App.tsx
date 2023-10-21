import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomModalDialogue from './Task_dialogue';
import {initializeApp} from 'firebase/app';
import {getFirestore, collection, addDoc} from 'firebase/firestore';
import {firebase} from '@react-native-firebase/firestore';
import {useEffect} from 'react';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_DETAILS',
  projectId: 'YOUR_FIREBASE_DETAILS',
  storageBucket: 'YOUR_FIREBASE_DETAILS',
  appId: 'YOUR_FIREBASE_DETAILS',
};
if (!firebase.apps.length) {
  initializeApp(firebaseConfig, '[DEFAULT]');
}
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
// Define a custom interface to match your Firestore data structure
interface TaskData {
  id: string;
  Task: string;
  Due_Date: string;
  //buttonColor: string;
  // Add other properties here based on the structure of your Firestore documents
}

const listItemStyles = StyleSheet.create({
  listItem: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDueDate: {
    fontSize: 14,
    color: 'gray',
  },
  Button: {
    //backgroundColor: 'red',
    borderColor: '#ccc',
    borderWidth: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

const styles = StyleSheet.create({
  Body: {
    flex: 1,
    backgroundColor: '#FAF3DD',
  },
  Container: {
    flex: 1,
    padding: 10,
  },
  Appbar: {
    height: 100,
    backgroundColor: '#8FC0A9',
  },
  Title: {
    alignItems: 'center',
    marginTop: 65,
    flex: 1,
  },
  ButtonContainer: {
    position: 'absolute',
    bottom: 25,
    right: 30,
  },
  Button: {
    backgroundColor: '#8FC0A9',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
});

const HomePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [date, setDate] = useState('2003-02-07');
  const [data, setData] = useState<TaskData[]>([]);
  //const [buttonColor, setbuttonColor] = useState('white');

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    const db = firebase.firestore();
    const Collectionref = db.collection('tasks');
    const unsubscribe = Collectionref.onSnapshot(QuerySnapshot => {
      const items: TaskData[] = [];
      QuerySnapshot.forEach(DocumentSnapshot =>
        items.push({
          id: DocumentSnapshot.id,
          Task: DocumentSnapshot.data().Task,
          Due_Date: DocumentSnapshot.data().Due_Date,
        }),
      );
      setData(items);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    const tasksCollection = collection(firestore, 'tasks');

    // Define the data you want to store
    const data = {
      Task: text,
      Due_Date: date,
    };

    // Add the data as a new document in the 'tasks' collection
    addDoc(tasksCollection, data)
      .then(docRef => {
        console.log('Document written with ID:', docRef.id);
        closeModal();
      })
      .catch(error => {
        console.error('Error adding document:', error);
      });
  };

  return (
    <View style={styles.Body}>
      <View style={styles.Appbar}>
        <View style={styles.Title}>
          <Text style={{fontSize: 20, fontStyle: 'italic'}}>To-Do</Text>
        </View>
      </View>
      <View style={styles.Container}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={listItemStyles.listItem}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={listItemStyles.itemName}>{item.Task}</Text>
                <TouchableOpacity
                  style={[listItemStyles.Button, {backgroundColor: 'white'}]}
                  onPress={() => {
                    //setbuttonColor('green');
                    const database = firebase.firestore();
                    const docRef = database.collection('tasks').doc(item.id);
                    docRef
                      .delete()
                      .then(() => {
                        console.log('Document successfully deleted!');
                      })
                      .catch(error => {
                        console.error('Error deleting document: ', error);
                      });
                  }}>
                  {/*<Text>Button</Text>*/}
                </TouchableOpacity>
              </View>
              <Text style={listItemStyles.itemDueDate}>{item.Due_Date}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.ButtonContainer}>
        <TouchableOpacity onPress={openModal}>
          <View style={styles.Button}>
            <Icon name="plus" size={25} color="white" />
          </View>
        </TouchableOpacity>
        <CustomModalDialogue
          visible={modalVisible}
          onDismiss={closeModal}
          onConfirm={handleConfirm}
          setText={setText}
          setDate={setDate}
          date={date}
        />
      </View>
    </View>
  );
};

export default HomePage;
