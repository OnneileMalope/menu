import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';

// NEW: Global styling constants
const CARD_STYLES = {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
};

const COURSE_COLORS = {
  Starter: '#4caf50',
  Main: '#2196f3', 
  Dessert: '#ff9800',
};

// NEW: Format price function
const formatPrice = (price) => {
  return `R ${parseFloat(price).toFixed(2)}`;
};

// NEW: Truncate text function using while loop
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  
  let truncated = '';
  let i = 0;
  
  while (i < maxLength - 3) {
    truncated += text[i];
    i++;
  }
  
  return truncated + '...';
};

export default function DishCard({ item, onEdit, onDelete, showActions = true }) {
  // NEW: Handle delete with confirmation
  const handleDelete = () => {
    Alert.alert(
      'Delete Menu Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

  // NEW: Get course color
  const getCourseColor = (course) => {
    return COURSE_COLORS[course] || '#6200ee';
  };

  // NEW: Render action buttons conditionally
  const renderActionButtons = () => {
    if (!showActions) return null;

    const buttons = [];
    const actions = [
      { label: 'Edit', onPress: onEdit, style: styles.editButton, textStyle: styles.editButtonText },
      { label: 'Delete', onPress: handleDelete, style: styles.deleteButton, textStyle: styles.deleteButtonText }
    ];

    // Using for loop to render action buttons
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      buttons.push(
        <Pressable
          key={action.label}
          onPress={action.onPress}
          style={[styles.actionButton, action.style]}
          android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
        >
          <Text style={[styles.actionButtonText, action.textStyle]}>
            {action.label}
          </Text>
        </Pressable>
      );
    }

    return (
      <View style={styles.actionsContainer}>
        {buttons}
      </View>
    );
  };

  // NEW: Render course badge
  const renderCourseBadge = () => {
    const courseColor = getCourseColor(item.course);
    
    return (
      <View style={[styles.courseBadge, { backgroundColor: courseColor }]}>
        <Text style={styles.courseBadgeText}>
          {item.course}
        </Text>
      </View>
    );
  };

  // NEW: Render price section
  const renderPriceSection = () => {
    return (
      <View style={styles.priceSection}>
        <Text style={styles.priceLabel}>Price:</Text>
        <Text style={styles.priceValue}>
          {formatPrice(item.price)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.dishName} numberOfLines={1}>
            {item.name}
          </Text>
          {renderCourseBadge()}
        </View>
        
        {/* Creation Date - NEW */}
        {item.createdAt && (
          <Text style={styles.createdDate}>
            Added: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {truncateText(item.description, 100)}
      </Text>

      {/* Footer Section */}
      <View style={styles.footer}>
        {renderPriceSection()}
        {renderActionButtons()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLES,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  courseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
  },
  courseBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  createdDate: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButtonText: {
    color: '#1976d2',
  },
  deleteButtonText: {
    color: '#d32f2f',
  },
});

// NEW: Export additional utilities for reuse
export { truncateText, formatPrice, COURSE_COLORS };