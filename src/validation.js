export function validateTripForm(formData) {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = "Title is required";
  } else if (formData.title.length > 50) {
    errors.title = "Title must be less than 50 characters";
  }

  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end < start) {
      errors.endDate = "End date must be after start date";
    }
  }

  if (formData.category === "Adventure" && !formData.description.trim()) {
    errors.description = "Description is required for Adventure trips";
  }

  return errors;
}

export function validateMemoryForm(formData) {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = "Title is required";
  }

  if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
    errors.imageUrl = "Please enter a valid URL";
  }

  return errors;
}

export function validatePlaceForm(formData) {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }

  if (formData.includeInItinerary && !formData.date) {
    errors.date = "Date is required when included in itinerary";
  }

  return errors;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
