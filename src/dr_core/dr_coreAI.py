import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, AgglomerativeClustering, SpectralClustering, Birch, MiniBatchKMeans
from sklearn.mixture import GaussianMixture
from sklearn.metrics import pairwise_distances_argmin

# Leer el dataset desde la carpeta database
df = pd.read_csv('../../database/dataset_picor.csv')

features = ['q1','q2','w1','w2','w3','w4','w5','w6','w7','w8']
X = df[features]
scaler = StandardScaler().fit(X)
X_scaled = scaler.transform(X)

# Entrenar cada modelo de clustering con 10 grupos
models = {
    'kmeans': KMeans(n_clusters=10, random_state=42).fit(X_scaled),
    'hierarchical': AgglomerativeClustering(n_clusters=10).fit(X_scaled),
    'gmm': GaussianMixture(n_components=10, random_state=42).fit(X_scaled),
    'spectral': SpectralClustering(n_clusters=10, assign_labels='kmeans', random_state=42).fit(X_scaled),
    'birch': Birch(n_clusters=10).fit(X_scaled),
    'minibatch': MiniBatchKMeans(n_clusters=10, random_state=42).fit(X_scaled)
}

# Construir diccionarios de mapeo cluster->nivel para cada modelo
cluster_to_scale = {}
for name, model in models.items():
    # Obtener etiquetas de clúster para todos los puntos de entrenamiento
    if name == 'gmm':
        labels = model.predict(X_scaled)
    else:
        # Agglomerative y Spectral almacenan labels_ tras fit(); otros usan predict
        labels = model.labels_ if hasattr(model, "labels_") else model.predict(X_scaled)
    df_clusters = pd.DataFrame(X_scaled, columns=features).assign(cluster=labels)
    centroids = df_clusters.groupby('cluster').mean()               # centroide (media) de cada grupo
    centroids['severity_index'] = centroids[['q1','q2']].mean(axis=1)  # índice de severidad
    # Ordenar clústeres por severidad y asignar escala 1-10
    ordered_clusters = centroids.sort_values('severity_index').index.tolist()
    cluster_to_scale[name] = {cluster: (i+1) for i, cluster in enumerate(ordered_clusters)}

# Función de predicción para nuevos pacientes
def predict_itch_level(patient_data: pd.DataFrame) -> np.ndarray:
    """Devuelve las estimaciones de nivel de picor para cada paciente en patient_data."""
    X_new = patient_data[features]
    X_new_scaled = scaler.transform(X_new)
    # Obtener predicciones de nivel de picor de cada modelo
    preds = []
    for name, model in models.items():
        # Predecir clúster del nuevo paciente según el modelo
        if name == 'gmm':
            labels_new = model.predict(X_new_scaled)
        elif hasattr(model, "predict"):
            labels_new = model.predict(X_new_scaled)
        else:
            # Modelos sin 'predict' (e.g. Agglomerative, Spectral): asignar al centroide más cercano
            train_centroids = pd.DataFrame(X_scaled, columns=features).assign(cluster=(model.labels_))
            train_centroids = train_centroids.groupby('cluster').mean()
            labels_new = pairwise_distances_argmin(X_new_scaled, train_centroids.values)
        # Mapear etiquetas a escala de picor usando el diccionario correspondiente
        levels = [cluster_to_scale[name][lbl] for lbl in labels_new]
        preds.append(levels)
    preds = np.array(preds)  # matriz (num_modelos x num_pacientes)
    # Combinar predicciones (promedio)
    avg_levels = preds.mean(axis=0)
    return avg_levels

# Calcular el nivel de picor para todo el dataset y guardarlo en una nueva columna
df['nivel de picor'] = predict_itch_level(df)

# Guardar el dataset actualizado en el mismo archivo (sobrescribe el original)
df.to_csv('../../database/dataset_picor.csv', index=False)

# --- Ejemplo de uso individual ---
new_patient = pd.DataFrame({
    'q1': [5], 'q2': [80], 'w1': [30], 'w2': [40], 'w3': [22], 'w4': [70], 'w5': [20], 'w6': [45], 'w7': [18], 'w8': [2]
})
nivel_picor = predict_itch_level(new_patient)[0]
print(f"Nivel de picor estimado: {nivel_picor:.2f}/10")