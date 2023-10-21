import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Modal, Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#FAF3DD',
    padding: 20,
  },
  title: {
    marginTop: 60,
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    fontSize: 30,
    color: 'black',
  },
  highlightedInput: {
    borderWidth: 2,
    borderColor: '#8FC0A9',
    borderRadius: 5,
    padding: 15,
    flex: 1,
    color: 'black',
  },
  datePicker: {
    width: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  selectedDate: {
    fontSize: 16,
    marginTop: 20,
    color: 'black',
  },
});

interface ModalTaskDialogueProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  setDate: (date: string) => void;
  setText: (text: string) => void;
  date: string;
}

const ModalTaskDialogue = (props: ModalTaskDialogueProps) => {
  const {visible, onDismiss, onConfirm, setDate, setText, date} = props;

  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      setDate(selectedDate?.toISOString().split('T')[0] || '');
      setShowDatePicker(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.Container}>
        <Text style={styles.title}>Add Task</Text>
        <Text style={{fontSize: 15, marginBottom: 15, color: 'black'}}>
          Enter Task
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Icon
            style={{paddingRight: 10, color: 'black'}}
            name="tasks"
            size={40}
          />
          <TextInput
            style={styles.highlightedInput}
            placeholder="Task Name"
            placeholderTextColor="black"
            onChangeText={text => setText(text)}
          />
        </View>

        {/* Calendar icon button to invoke the DateTimePicker */}
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <Icon
            name="calendar"
            size={40}
            color="black"
            style={{marginRight: 15, marginBottom: 15}}
            onPress={toggleDatePicker}
          />
          <Text style={{fontSize: 16, color: 'black'}}>{date}</Text>
        </View>

        {/* Date picker */}
        {showDatePicker && (
          <DateTimePicker
            style={styles.datePicker}
            value={new Date(date)}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* Buttons for Cancel and Confirm */}
        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={onDismiss} />
          <Button title="Confirm" onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );
};

export default ModalTaskDialogue;
