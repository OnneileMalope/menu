import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Card, Button, TextInput, Modal, Portal } from 'react-native-paper';
import { addMenuItem, removeMenuItem, getAllMenuItems } from '../data/menuManager';
import { validateMenuItem } from '../utils/validation';
import { COURSE_TYPES, COURSE_LABELS } from '../data/constants';
import { MenuItem, ScreenType } from '../types';

interface Props {
  onNavigate: (screen: ScreenType) => void;
}

const AdminScreen: React.FC<Props> = ({ onNavigate }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getAllMenuItems());
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    course: '',
  });

  const refreshMenu = () => {
    setMenuItems(getAllMenuItems());
  };

  const handleAddItem = () => {
    const newItem = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      course: formData.course as any,
      ingredients: [],
    };

    if (!validateMenuItem(newItem)) {
      Alert.alert('Error', 'Please fill in all fields correctly');
      return;
    }

    addMenuItem(newItem);
    refreshMenu();
    setFormData({ name: '', description: '', price: '', course: '' });
    setModalVisible(false);
    Alert.alert('Success', 'Menu item added successfully!');
  };

  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeMenuItem(id);
            refreshMenu();
            Alert.alert('Success', 'Menu item removed successfully!');
          },
        },
      ]
    );
  };

  const renderCurrentItems = () => {
    if (menuItems.length === 0) {
      return (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>
              No menu items yet. Add your first item!
            </Text>
          </Card.Content>
        </Card>
      );
    }

    const items = [];
    
    // Using for loop to render admin items
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      items.push(
        <Card key={item.id} style={styles.adminItemCard}>
          <Card.Content>
            <View style={styles.adminItemHeader}>
              <Text style={styles.adminItemName}>{item.name}</Text>
              <Button
                mode="outlined"
                compact
                onPress={() => handleRemoveItem(item.id, item.name)}
                style={styles.removeButton}
              >
                Remove
              </Button>
            </View>
            <Text style={styles.adminItemDescription}>{item.description}</Text>
            <View style={styles.adminItemFooter}>
              <Text style={styles.adminItemPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.adminItemCourse}>
                {COURSE_LABELS[item.course as keyof typeof COURSE_LABELS] || item.course}
              </Text>
            </View>
          </Card.Content>
        </Card>
      );
    }
    
    return items;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Menu Management</Text>

      {/* Add Item Button */}
      <Button
        mode="contained"
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
        icon="plus"
      >
        Add New Menu Item
      </Button>

      {/* Current Items */}
      <Text style={styles.sectionTitle}>Current Menu Items ({menuItems.length})</Text>
      <View style={styles.itemsContainer}>
        {renderCurrentItems()}
      </View>

      {/* Back Button */}
      <Button
        mode="outlined"
        onPress={() => onNavigate('home')}
        style={styles.backButton}
      >
        Back to Home
      </Button>

      {/* Add Item Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Add Menu Item</Text>
          
          <TextInput
            label="Item Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />
          
          <TextInput
            label="Price"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            style={styles.input}
            mode="outlined"
            keyboardType="decimal-pad"
          />
          
          <TextInput
            label="Course"
            value={formData.course}
            onChangeText={(text) => setFormData({ ...formData, course: text })}
            style={styles.input}
            mode="outlined"
            placeholder="starter, main, dessert, or beverage"
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddItem}
              style={styles.modalButton}
            >
              Add Item
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  addButton: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  itemsContainer: {
    marginBottom: 20,
  },
  adminItemCard: {
    marginBottom: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  adminItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  adminItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  removeButton: {
    minWidth: 80,
  },
  adminItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  adminItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  adminItemCourse: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyCard: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default AdminScreen;