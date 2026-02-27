# Passive Acoustic Monitoring

## What is Passive Acoustic Monitoring?

Passive Acoustic Monitoring (PAM) is a non-invasive technique used to study marine environments by recording and analyzing underwater sounds. Unlike active acoustics (such as sonar), PAM systems only listen - they do not emit any sounds that could disturb marine life.

PAM has become an essential tool for marine biologists, conservationists, and oceanographers to monitor ocean health, track marine species, and assess the impact of human activities on marine ecosystems.

## How Does PAM Work?

PAM systems consist of hydrophones (underwater microphones) that are deployed in the ocean to continuously record sounds. These recordings capture a wide range of acoustic signals including:

- **Biological sounds:** Whale songs, dolphin clicks, fish choruses, snapping shrimp
- **Geophysical sounds:** Earthquakes, ice cracking, underwater volcanic activity
- **Anthropogenic sounds:** Ship traffic, sonar, seismic surveys, construction

## Recording Equipment

Modern PAM systems use high-quality hydrophones capable of recording frequencies from infrasound (below 20 Hz) to ultrasound (above 20 kHz). Common deployment methods include:

- **Bottom-mounted recorders:** Anchored to the seafloor for long-term monitoring
- **Drifting buoys:** Free-floating systems that follow ocean currents
- **Towed arrays:** Hydrophones towed behind research vessels
- **Gliders and AUVs:** Autonomous underwater vehicles with integrated hydrophones

## Data Analysis: Manual Methods

Manual analysis involves trained experts examining spectrograms - visual representations of sound showing frequency over time. Analysts identify and annotate acoustic events by:

1. Reviewing spectrograms for distinctive patterns
2. Listening to audio segments to confirm identifications
3. Marking the time and frequency bounds of detected sounds
4. Classifying sounds into categories (species, call types, noise sources)
5. Recording confidence levels and additional notes

While time-consuming, manual analysis remains the gold standard for accuracy and is essential for training automated systems.

## Data Analysis: Automated Methods

With the vast amounts of data collected by PAM systems, automated detection and classification methods have become increasingly important:

### Template Matching
Comparing recorded sounds against known templates using cross-correlation techniques. Effective for stereotyped calls but limited for variable sounds.

### Energy Detection
Identifying sounds based on energy levels exceeding background noise thresholds. Simple but prone to false positives in noisy environments.

### Machine Learning
Modern approaches use deep learning models trained on annotated datasets to automatically detect and classify sounds:

- **Convolutional Neural Networks (CNNs):** Process spectrogram images
- **Recurrent Neural Networks (RNNs):** Capture temporal patterns
- **Transformers:** State-of-the-art models for acoustic classification

## Applications

PAM data supports a wide range of research and conservation applications:

- Population monitoring of endangered marine mammals
- Studying animal behavior and communication
- Assessing impacts of noise pollution on marine life
- Monitoring marine protected areas
- Environmental impact assessments for offshore development
- Climate change research through soundscape ecology

## The Role of APLOSE

APLOSE (Annotation Platform for Ocean Sound Exploration) is designed to streamline the manual annotation process. By providing efficient tools for visualizing and annotating spectrograms, APLOSE helps researchers:

- Process large acoustic datasets more efficiently
- Maintain consistent annotation standards across teams
- Build high-quality training datasets for machine learning
- Collaborate on annotation campaigns
