import API from "../../../API";

const fetchData = async (selectedType, setData, setError, setLoading) => {
  try {
    const filters = selectedType === "All" ? {} : { type: selectedType };
    const documents = await API.getDocuments(filters, true);
    const updatedDocuments = documents.map((doc) => {
      if (!doc.coordinates || doc.coordinates.length === 0) {
        return { ...doc, lat: null, long: null };
      } else {
        if (doc.coordinates.length > 1) {
          // Function to find the highest point in a polygon, where the popup and the marker will be shown
          const highestPoint = doc.coordinates.reduce(
            (max, [lat, long]) => {
              return lat > max.lat ? { lat, long } : max;
            },
            { lat: doc.coordinates[0][0], long: doc.coordinates[0][1] }
          );

          const area = doc.coordinates.map(([lat, long]) => [lat, long]);

          return {
            ...doc,
            lat: highestPoint.lat,
            long: highestPoint.long,
            area,
          };
        } else {
          // Single coordinate
          const { lat, long } = doc.coordinates;
          return {
            ...doc,
            lat,
            long,
          };
        }
      }
    });
    setData(updatedDocuments);
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};

export default fetchData;
