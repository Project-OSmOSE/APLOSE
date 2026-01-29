export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AccessibilityEnum: { input: any; output: any; }
  /**
   * The `BigInt` scalar type represents non-fractional whole numeric values.
   * `BigInt` is not constrained to 32-bit like the `Int` type and thus is a less
   * compatible type.
   */
  BigInt: { input: any; output: any; }
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: { input: any; output: any; }
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: { input: any; output: any; }
  /** The `Decimal` scalar type represents a python Decimal. */
  Decimal: { input: any; output: any; }
  FinancingEnum: { input: any; output: any; }
  HydrophoneDirectivityEnum: { input: any; output: any; }
  RoleEnum: { input: any; output: any; }
  SignalPluralityEnum: { input: any; output: any; }
  SignalShapeEnum: { input: any; output: any; }
  StatusEnum: { input: any; output: any; }
  TypeEnum: { input: any; output: any; }
};

export type AcousticDetectorSpecificationNode = Node & {
  __typename?: 'AcousticDetectorSpecificationNode';
  algorithmName?: Maybe<Scalars['String']['output']>;
  detectedLabels: LabelNodeConnection;
  detectorSet: DetectorNodeConnection;
  id: Scalars['ID']['output'];
  maxFrequency?: Maybe<Scalars['Int']['output']>;
  minFrequency?: Maybe<Scalars['Int']['output']>;
};


export type AcousticDetectorSpecificationNodeDetectedLabelsArgs = {
  acousticDetectors_Id?: InputMaybe<Scalars['Decimal']['input']>;
  acousticDetectors_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  meanDuration?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gte?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lte?: InputMaybe<Scalars['Float']['input']>;
  minFrequency?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  nickname_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  plurality?: InputMaybe<Scalars['SignalPluralityEnum']['input']>;
  shape?: InputMaybe<Scalars['SignalShapeEnum']['input']>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type AcousticDetectorSpecificationNodeDetectorSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type AcousticDetectorSpecificationNodeConnection = {
  __typename?: 'AcousticDetectorSpecificationNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AcousticDetectorSpecificationNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AcousticDetectorSpecificationNode` and its cursor. */
export type AcousticDetectorSpecificationNodeEdge = {
  __typename?: 'AcousticDetectorSpecificationNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AcousticDetectorSpecificationNode>;
};

export type AcousticDetectorSpecificationNodeNodeConnection = {
  __typename?: 'AcousticDetectorSpecificationNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AcousticDetectorSpecificationNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** Annotation schema */
export type AcousticFeaturesNode = ExtendedInterface & {
  __typename?: 'AcousticFeaturesNode';
  annotation?: Maybe<AnnotationNode>;
  /** [Hz] Frequency at the end of the signal */
  endFrequency?: Maybe<Scalars['Float']['output']>;
  /** If the signal has harmonics */
  hasHarmonics?: Maybe<Scalars['Boolean']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Number of relative maximum frequency in the signal */
  relativeMaxFrequencyCount?: Maybe<Scalars['Int']['output']>;
  /** Number of relative minimum frequency in the signal */
  relativeMinFrequencyCount?: Maybe<Scalars['Int']['output']>;
  /** [Hz] Frequency at the beginning of the signal */
  startFrequency?: Maybe<Scalars['Float']['output']>;
  /** Number of steps (flat segment) in the signal */
  stepsCount?: Maybe<Scalars['Int']['output']>;
  trend?: Maybe<SignalTrendType>;
};

export type AnnotationAcousticFeaturesSerializerInput = {
  /** [Hz] Frequency at the end of the signal */
  endFrequency?: InputMaybe<Scalars['Float']['input']>;
  /** If the signal has harmonics */
  hasHarmonics?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Number of relative maximum frequency in the signal */
  relativeMaxFrequencyCount?: InputMaybe<Scalars['Int']['input']>;
  /** Number of relative minimum frequency in the signal */
  relativeMinFrequencyCount?: InputMaybe<Scalars['Int']['input']>;
  /** [Hz] Frequency at the beginning of the signal */
  startFrequency?: InputMaybe<Scalars['Float']['input']>;
  /** Number of steps (flat segment) in the signal */
  stepsCount?: InputMaybe<Scalars['Int']['input']>;
  trend?: InputMaybe<SignalTrendType>;
};

/** AnnotationCampaign schema */
export type AnnotationCampaignNode = ExtendedInterface & {
  __typename?: 'AnnotationCampaignNode';
  allowColormapTuning: Scalars['Boolean']['output'];
  allowImageTuning: Scalars['Boolean']['output'];
  allowPointAnnotation: Scalars['Boolean']['output'];
  analysis: SpectrogramAnalysisNodeConnection;
  annotators?: Maybe<Array<Maybe<UserNode>>>;
  archive?: Maybe<ArchiveNode>;
  canManage: Scalars['Boolean']['output'];
  colormapDefault?: Maybe<Scalars['String']['output']>;
  colormapInvertedDefault?: Maybe<Scalars['Boolean']['output']>;
  completedTasksCount: Scalars['Int']['output'];
  confidenceSet?: Maybe<ConfidenceSetNode>;
  createdAt: Scalars['DateTime']['output'];
  dataset: DatasetNode;
  datasetName: Scalars['String']['output'];
  deadline?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detectors?: Maybe<Array<Maybe<DetectorNode>>>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  instructionsUrl?: Maybe<Scalars['String']['output']>;
  isArchived: Scalars['Boolean']['output'];
  labelSet?: Maybe<LabelSetNode>;
  labelsWithAcousticFeatures?: Maybe<Array<Maybe<AnnotationLabelNode>>>;
  name: Scalars['String']['output'];
  owner: UserNode;
  phases?: Maybe<AnnotationPhaseNodeNodeConnection>;
  spectrogramsCount: Scalars['Int']['output'];
  tasksCount: Scalars['Int']['output'];
  userCompletedTasksCount: Scalars['Int']['output'];
  userTasksCount: Scalars['Int']['output'];
};


/** AnnotationCampaign schema */
export type AnnotationCampaignNodeAnalysisArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaigns_Id?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
};


/** AnnotationCampaign schema */
export type AnnotationCampaignNodePhasesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaignId?: InputMaybe<Scalars['ID']['input']>;
  annotationCampaign_OwnerId?: InputMaybe<Scalars['ID']['input']>;
  annotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isCampaignArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type AnnotationCampaignNodeConnection = {
  __typename?: 'AnnotationCampaignNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AnnotationCampaignNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AnnotationCampaignNode` and its cursor. */
export type AnnotationCampaignNodeEdge = {
  __typename?: 'AnnotationCampaignNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AnnotationCampaignNode>;
};

export type AnnotationCampaignNodeNodeConnection = {
  __typename?: 'AnnotationCampaignNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AnnotationCampaignNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type AnnotationCommentInput = {
  comment: Scalars['String']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** AnnotationComment schema */
export type AnnotationCommentNode = ExtendedInterface & {
  __typename?: 'AnnotationCommentNode';
  annotation?: Maybe<AnnotationNode>;
  annotationPhase: AnnotationPhaseNode;
  author: UserNode;
  comment: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  spectrogram: AnnotationSpectrogramNode;
};

export type AnnotationCommentNodeConnection = {
  __typename?: 'AnnotationCommentNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AnnotationCommentNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AnnotationCommentNode` and its cursor. */
export type AnnotationCommentNodeEdge = {
  __typename?: 'AnnotationCommentNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AnnotationCommentNode>;
};

export type AnnotationCommentNodeNodeConnection = {
  __typename?: 'AnnotationCommentNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AnnotationCommentNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type AnnotationCommentSerializerInput = {
  annotation?: InputMaybe<Scalars['String']['input']>;
  annotationPhase?: InputMaybe<Scalars['String']['input']>;
  author?: InputMaybe<Scalars['String']['input']>;
  comment: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  spectrogram?: InputMaybe<Scalars['String']['input']>;
};

export type AnnotationFileRangeInput = {
  annotatorId?: InputMaybe<Scalars['ID']['input']>;
  firstFileIndex: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  lastFileIndex: Scalars['Int']['input'];
};

/** AnnotationFileRange schema */
export type AnnotationFileRangeNode = ExtendedInterface & {
  __typename?: 'AnnotationFileRangeNode';
  annotationPhase: AnnotationPhaseNode;
  annotationTasks?: Maybe<AnnotationTaskNodeNodeConnection>;
  annotator: UserNode;
  filesCount: Scalars['Int']['output'];
  firstFileIndex: Scalars['Int']['output'];
  fromDatetime: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  lastFileIndex: Scalars['Int']['output'];
  spectrograms?: Maybe<SpectrogramNodeNodeConnection>;
  toDatetime: Scalars['DateTime']['output'];
};


/** AnnotationFileRange schema */
export type AnnotationFileRangeNodeAnnotationTasksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotations_AcousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_Annotator?: InputMaybe<Scalars['ID']['input']>;
  annotations_Confidence_Label?: InputMaybe<Scalars['String']['input']>;
  annotations_Detector?: InputMaybe<Scalars['ID']['input']>;
  annotations_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_LabelName?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  spectrogram_End_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  spectrogram_Filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  spectrogram_Start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<AnnotationTaskStatus>;
};


/** AnnotationFileRange schema */
export type AnnotationFileRangeNodeSpectrogramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotatedByAnnotator?: InputMaybe<Scalars['ID']['input']>;
  annotatedByDetector?: InputMaybe<Scalars['ID']['input']>;
  annotatedWithConfidence?: InputMaybe<Scalars['String']['input']>;
  annotatedWithFeatures?: InputMaybe<Scalars['Boolean']['input']>;
  annotatedWithLabel?: InputMaybe<Scalars['String']['input']>;
  annotatorId?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  end?: InputMaybe<Scalars['DateTime']['input']>;
  end_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  end_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  end_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  end_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hasAnnotations?: InputMaybe<Scalars['Boolean']['input']>;
  isTaskCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  phaseType?: InputMaybe<AnnotationPhaseType>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
  start_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  start_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  start_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AnnotationFileRangeNodeConnection = {
  __typename?: 'AnnotationFileRangeNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AnnotationFileRangeNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AnnotationFileRangeNode` and its cursor. */
export type AnnotationFileRangeNodeEdge = {
  __typename?: 'AnnotationFileRangeNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AnnotationFileRangeNode>;
};

export type AnnotationFileRangeNodeNodeConnection = {
  __typename?: 'AnnotationFileRangeNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AnnotationFileRangeNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type AnnotationInput = {
  acousticFeatures?: InputMaybe<AnnotationAcousticFeaturesSerializerInput>;
  analysis: Scalars['String']['input'];
  annotationPhase: Scalars['String']['input'];
  annotator?: InputMaybe<Scalars['String']['input']>;
  comments?: InputMaybe<Array<InputMaybe<AnnotationCommentSerializerInput>>>;
  confidence?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration?: InputMaybe<Scalars['String']['input']>;
  endFrequency?: InputMaybe<Scalars['Float']['input']>;
  endTime?: InputMaybe<Scalars['Float']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isUpdateOf?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  startFrequency?: InputMaybe<Scalars['Float']['input']>;
  startTime?: InputMaybe<Scalars['Float']['input']>;
  validations?: InputMaybe<Array<InputMaybe<AnnotationValidationSerializerInput>>>;
};

/** Label schema */
export type AnnotationLabelNode = ExtendedInterface & {
  __typename?: 'AnnotationLabelNode';
  annotationSet: AnnotationNodeConnection;
  annotationcampaignSet: AnnotationCampaignNodeConnection;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  labelsetSet: LabelSetNodeConnection;
  metadataxLabel?: Maybe<LabelNode>;
  name: Scalars['String']['output'];
  uses: Scalars['Int']['output'];
};


/** Label schema */
export type AnnotationLabelNodeAnnotationSetArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Label schema */
export type AnnotationLabelNodeAnnotationcampaignSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  phases_AnnotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  phases_Phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};


/** Label schema */
export type AnnotationLabelNodeLabelsetSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  labels?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Label schema */
export type AnnotationLabelNodeUsesArgs = {
  deploymentId?: InputMaybe<Scalars['ID']['input']>;
};

export type AnnotationLabelNodeConnection = {
  __typename?: 'AnnotationLabelNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AnnotationLabelNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AnnotationLabelNode` and its cursor. */
export type AnnotationLabelNodeEdge = {
  __typename?: 'AnnotationLabelNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AnnotationLabelNode>;
};

export type AnnotationLabelNodeNodeConnection = {
  __typename?: 'AnnotationLabelNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AnnotationLabelNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** Annotation schema */
export type AnnotationNode = ExtendedInterface & {
  __typename?: 'AnnotationNode';
  /** Acoustic features add a better description to the signal */
  acousticFeatures?: Maybe<AcousticFeaturesNode>;
  analysis: SpectrogramAnalysisNode;
  annotationComments: AnnotationCommentNodeConnection;
  annotationPhase: AnnotationPhaseNode;
  annotator?: Maybe<UserNode>;
  /** Expertise level of the annotator. */
  annotatorExpertiseLevel?: Maybe<ApiAnnotationAnnotatorExpertiseLevelChoices>;
  comments?: Maybe<AnnotationCommentNodeNodeConnection>;
  confidence?: Maybe<ConfidenceNode>;
  createdAt: Scalars['DateTime']['output'];
  detectorConfiguration?: Maybe<DetectorConfigurationNode>;
  endFrequency?: Maybe<Scalars['Float']['output']>;
  endTime?: Maybe<Scalars['Float']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isUpdateOf?: Maybe<AnnotationNode>;
  label: AnnotationLabelNode;
  lastUpdatedAt: Scalars['DateTime']['output'];
  spectrogram: AnnotationSpectrogramNode;
  startFrequency?: Maybe<Scalars['Float']['output']>;
  startTime?: Maybe<Scalars['Float']['output']>;
  type: AnnotationType;
  updatedTo: AnnotationNodeConnection;
  validations?: Maybe<AnnotationValidationNodeNodeConnection>;
};


/** Annotation schema */
export type AnnotationNodeAnnotationCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotation_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  author?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Annotation schema */
export type AnnotationNodeCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotation_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  author?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Annotation schema */
export type AnnotationNodeUpdatedToArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Annotation schema */
export type AnnotationNodeValidationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};

export type AnnotationNodeConnection = {
  __typename?: 'AnnotationNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AnnotationNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AnnotationNode` and its cursor. */
export type AnnotationNodeEdge = {
  __typename?: 'AnnotationNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AnnotationNode>;
};

export type AnnotationNodeNodeConnection = {
  __typename?: 'AnnotationNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AnnotationNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** AnnotationPhase schema */
export type AnnotationPhaseNode = ExtendedInterface & {
  __typename?: 'AnnotationPhaseNode';
  annotationCampaign: AnnotationCampaignNode;
  annotationCampaignId: Scalars['ID']['output'];
  annotationComments: AnnotationCommentNodeConnection;
  annotationFileRanges?: Maybe<AnnotationFileRangeNodeNodeConnection>;
  annotationSpectrograms?: Maybe<AnnotationSpectrogramNodeNodeConnection>;
  annotationTasks: AnnotationTaskNodeConnection;
  annotations: AnnotationNodeConnection;
  canManage: Scalars['Boolean']['output'];
  completedTasksCount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: UserNode;
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  endedBy?: Maybe<UserNode>;
  hasAnnotations: Scalars['Boolean']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  isOpen: Scalars['Boolean']['output'];
  phase: AnnotationPhaseType;
  tasksCount: Scalars['Int']['output'];
  userCompletedTasksCount: Scalars['Int']['output'];
  userTasksCount: Scalars['Int']['output'];
};


/** AnnotationPhase schema */
export type AnnotationPhaseNodeAnnotationCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotation_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  author?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** AnnotationPhase schema */
export type AnnotationPhaseNodeAnnotationFileRangesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationPhase_AnnotationCampaign?: InputMaybe<Scalars['ID']['input']>;
  annotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** AnnotationPhase schema */
export type AnnotationPhaseNodeAnnotationSpectrogramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaign?: InputMaybe<Scalars['ID']['input']>;
  annotationTasks_Status?: InputMaybe<AnnotationTaskStatus>;
  annotations_AcousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_Annotator?: InputMaybe<Scalars['ID']['input']>;
  annotations_Confidence_Label?: InputMaybe<Scalars['String']['input']>;
  annotations_Detector?: InputMaybe<Scalars['ID']['input']>;
  annotations_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_LabelName?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  end_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  phase?: InputMaybe<AnnotationPhaseType>;
  start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


/** AnnotationPhase schema */
export type AnnotationPhaseNodeAnnotationTasksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotations_AcousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_Annotator?: InputMaybe<Scalars['ID']['input']>;
  annotations_Confidence_Label?: InputMaybe<Scalars['String']['input']>;
  annotations_Detector?: InputMaybe<Scalars['ID']['input']>;
  annotations_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_LabelName?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  spectrogram_End_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  spectrogram_Filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  spectrogram_Start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<AnnotationTaskStatus>;
};


/** AnnotationPhase schema */
export type AnnotationPhaseNodeAnnotationsArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type AnnotationPhaseNodeConnection = {
  __typename?: 'AnnotationPhaseNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AnnotationPhaseNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AnnotationPhaseNode` and its cursor. */
export type AnnotationPhaseNodeEdge = {
  __typename?: 'AnnotationPhaseNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AnnotationPhaseNode>;
};

export type AnnotationPhaseNodeNodeConnection = {
  __typename?: 'AnnotationPhaseNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AnnotationPhaseNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** From AnnotationPhase.Type */
export enum AnnotationPhaseType {
  Annotation = 'Annotation',
  Verification = 'Verification'
}

export type AnnotationSpectrogramNode = ExtendedInterface & {
  __typename?: 'AnnotationSpectrogramNode';
  analysis: SpectrogramAnalysisNodeConnection;
  annotationComments?: Maybe<AnnotationCommentNodeNodeConnection>;
  annotationTasks: AnnotationTaskNodeConnection;
  annotations: AnnotationNodeConnection;
  audioPath?: Maybe<Scalars['String']['output']>;
  duration: Scalars['Int']['output'];
  end: Scalars['DateTime']['output'];
  filename: Scalars['String']['output'];
  format: FileFormatNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isAssigned: Scalars['Boolean']['output'];
  path: Scalars['String']['output'];
  start: Scalars['DateTime']['output'];
  task?: Maybe<AnnotationTaskNode>;
};


export type AnnotationSpectrogramNodeAnalysisArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaigns_Id?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
};


export type AnnotationSpectrogramNodeAnnotationCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotation_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  author?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


export type AnnotationSpectrogramNodeAnnotationTasksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotations_AcousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_Annotator?: InputMaybe<Scalars['ID']['input']>;
  annotations_Confidence_Label?: InputMaybe<Scalars['String']['input']>;
  annotations_Detector?: InputMaybe<Scalars['ID']['input']>;
  annotations_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_LabelName?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  spectrogram_End_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  spectrogram_Filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  spectrogram_Start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<AnnotationTaskStatus>;
};


export type AnnotationSpectrogramNodeAnnotationsArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type AnnotationSpectrogramNodeAudioPathArgs = {
  analysisId: Scalars['ID']['input'];
};


export type AnnotationSpectrogramNodeIsAssignedArgs = {
  campaignId: Scalars['ID']['input'];
  phase: AnnotationPhaseType;
};


export type AnnotationSpectrogramNodePathArgs = {
  analysisId: Scalars['ID']['input'];
};


export type AnnotationSpectrogramNodeTaskArgs = {
  campaignId: Scalars['ID']['input'];
  phase: AnnotationPhaseType;
};

export type AnnotationSpectrogramNodeConnection = {
  __typename?: 'AnnotationSpectrogramNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AnnotationSpectrogramNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AnnotationSpectrogramNode` and its cursor. */
export type AnnotationSpectrogramNodeEdge = {
  __typename?: 'AnnotationSpectrogramNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AnnotationSpectrogramNode>;
};

/** Annotation spectrogram node connection */
export type AnnotationSpectrogramNodeNodeConnection = {
  __typename?: 'AnnotationSpectrogramNodeNodeConnection';
  currentIndex?: Maybe<Scalars['Int']['output']>;
  nextSpectrogramId?: Maybe<Scalars['ID']['output']>;
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  previousSpectrogramId?: Maybe<Scalars['ID']['output']>;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AnnotationSpectrogramNode>>;
  resumeSpectrogramId?: Maybe<Scalars['ID']['output']>;
  totalCount: Scalars['Int']['output'];
};


/** Annotation spectrogram node connection */
export type AnnotationSpectrogramNodeNodeConnectionCurrentIndexArgs = {
  spectrogramId?: InputMaybe<Scalars['ID']['input']>;
};


/** Annotation spectrogram node connection */
export type AnnotationSpectrogramNodeNodeConnectionNextSpectrogramIdArgs = {
  spectrogramId?: InputMaybe<Scalars['ID']['input']>;
};


/** Annotation spectrogram node connection */
export type AnnotationSpectrogramNodeNodeConnectionPreviousSpectrogramIdArgs = {
  spectrogramId?: InputMaybe<Scalars['ID']['input']>;
};


/** Annotation spectrogram node connection */
export type AnnotationSpectrogramNodeNodeConnectionResumeSpectrogramIdArgs = {
  campaignId: Scalars['ID']['input'];
  phase: AnnotationPhaseType;
};

/** AnnotationTask schema */
export type AnnotationTaskNode = ExtendedInterface & {
  __typename?: 'AnnotationTaskNode';
  annotationPhase: AnnotationPhaseNode;
  annotationsToCheck?: Maybe<AnnotationNodeNodeConnection>;
  annotator: UserNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  spectrogram: AnnotationSpectrogramNode;
  status: AnnotationTaskStatus;
  userAnnotations?: Maybe<AnnotationNodeNodeConnection>;
  userComments?: Maybe<AnnotationCommentNodeNodeConnection>;
};


/** AnnotationTask schema */
export type AnnotationTaskNodeAnnotationsToCheckArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** AnnotationTask schema */
export type AnnotationTaskNodeUserAnnotationsArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** AnnotationTask schema */
export type AnnotationTaskNodeUserCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotation_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  author?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};

export type AnnotationTaskNodeConnection = {
  __typename?: 'AnnotationTaskNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AnnotationTaskNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AnnotationTaskNode` and its cursor. */
export type AnnotationTaskNodeEdge = {
  __typename?: 'AnnotationTaskNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AnnotationTaskNode>;
};

export type AnnotationTaskNodeNodeConnection = {
  __typename?: 'AnnotationTaskNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AnnotationTaskNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** From AnnotationTask.Status */
export enum AnnotationTaskStatus {
  Created = 'Created',
  Finished = 'Finished'
}

/** From Annotation.Type */
export enum AnnotationType {
  Box = 'Box',
  Point = 'Point',
  Weak = 'Weak'
}

/** AnnotationValidation schema */
export type AnnotationValidationNode = ExtendedInterface & {
  __typename?: 'AnnotationValidationNode';
  annotation: AnnotationNode;
  annotator: UserNode;
  createdAt: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isValid: Scalars['Boolean']['output'];
  lastUpdatedAt: Scalars['DateTime']['output'];
};

export type AnnotationValidationNodeConnection = {
  __typename?: 'AnnotationValidationNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AnnotationValidationNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AnnotationValidationNode` and its cursor. */
export type AnnotationValidationNodeEdge = {
  __typename?: 'AnnotationValidationNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AnnotationValidationNode>;
};

export type AnnotationValidationNodeNodeConnection = {
  __typename?: 'AnnotationValidationNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AnnotationValidationNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type AnnotationValidationSerializerInput = {
  annotation?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isValid: Scalars['Boolean']['input'];
  lastUpdatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

/** An enumeration. */
export enum ApiAnnotationAnnotatorExpertiseLevelChoices {
  /** Average */
  A = 'A',
  /** Expert */
  E = 'E',
  /** Novice */
  N = 'N'
}

/** Archive annotation campaign mutation */
export type ArchiveAnnotationCampaignMutation = {
  __typename?: 'ArchiveAnnotationCampaignMutation';
  ok: Scalars['Boolean']['output'];
};

/** Archive schema */
export type ArchiveNode = ExtendedInterface & {
  __typename?: 'ArchiveNode';
  annotationCampaign?: Maybe<AnnotationCampaignNode>;
  byUser?: Maybe<UserNode>;
  date: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

export type ArchiveNodeConnection = {
  __typename?: 'ArchiveNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ArchiveNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ArchiveNode` and its cursor. */
export type ArchiveNodeEdge = {
  __typename?: 'ArchiveNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ArchiveNode>;
};

export type AudioPropertiesNode = Node & {
  __typename?: 'AudioPropertiesNode';
  /** Duration of the audio file (in seconds). */
  duration: Scalars['Int']['output'];
  file?: Maybe<FileNode>;
  id: Scalars['ID']['output'];
  /** Date and time of the audio file start (in UTC). */
  initialTimestamp: Scalars['DateTime']['output'];
  /** Number of quantization bits used to represent each sample (in bits). If it is different from the channel sampling frequency, re-quantization has been performed. */
  sampleDepth?: Maybe<Scalars['Int']['output']>;
  /** Sampling frequency of the audio file (in Hertz). If it is different from the channel sampling frequency, resampling has been performed. */
  samplingFrequency: Scalars['Int']['output'];
};

export type AudioPropertiesNodeNodeConnection = {
  __typename?: 'AudioPropertiesNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AudioPropertiesNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type AuthorNode = Node & {
  __typename?: 'AuthorNode';
  bibliography: BibliographyNode;
  contact?: Maybe<ContactNode>;
  id: Scalars['ID']['output'];
  institutions: InstitutionNodeConnection;
  order: Scalars['Int']['output'];
};


export type AuthorNodeInstitutionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyAuthors_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownedEquipments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  ownedPlatforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  performedMaintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  providedEquipments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  providedPlatforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  roles_Id?: InputMaybe<Scalars['Decimal']['input']>;
};

export type AuthorNodeConnection = {
  __typename?: 'AuthorNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AuthorNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AuthorNode` and its cursor. */
export type AuthorNodeEdge = {
  __typename?: 'AuthorNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AuthorNode>;
};

export type AuthorNodeNodeConnection = {
  __typename?: 'AuthorNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AuthorNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type BibliographyArticleNode = Node & {
  __typename?: 'BibliographyArticleNode';
  articleNb?: Maybe<Scalars['Int']['output']>;
  bibliography?: Maybe<BibliographyNode>;
  id: Scalars['ID']['output'];
  issueNb?: Maybe<Scalars['Int']['output']>;
  /** Required for an article */
  journal: Scalars['String']['output'];
  pagesFrom?: Maybe<Scalars['Int']['output']>;
  pagesTo?: Maybe<Scalars['Int']['output']>;
  volumes?: Maybe<Scalars['String']['output']>;
};

export type BibliographyConferenceNode = Node & {
  __typename?: 'BibliographyConferenceNode';
  bibliography: BibliographyNodeConnection;
  conferenceAbstractBookUrl?: Maybe<Scalars['String']['output']>;
  /** Required for a conference (format: {City}, {Country}) */
  conferenceLocation: Scalars['String']['output'];
  /** Required for a conference */
  conferenceName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};


export type BibliographyConferenceNodeBibliographyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['StatusEnum']['input']>;
  tags_Name?: InputMaybe<Scalars['String']['input']>;
  tags_Name_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['TypeEnum']['input']>;
};

export type BibliographyNode = Node & {
  __typename?: 'BibliographyNode';
  /** Each information is dedicated to one file. */
  articleInformation?: Maybe<BibliographyArticleNode>;
  authors: AuthorNodeConnection;
  conferenceInformation?: Maybe<BibliographyConferenceNode>;
  doi?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** Each information is dedicated to one file. */
  posterInformation?: Maybe<BibliographyPosterNode>;
  /** Required for any published bibliography */
  publicationDate?: Maybe<Scalars['Date']['output']>;
  relatedLabels: LabelNodeConnection;
  relatedProjects: ProjectNodeOverrideConnection;
  relatedSounds: SoundNodeConnection;
  relatedSources: SourceNodeConnection;
  /** Each information is dedicated to one file. */
  softwareInformation?: Maybe<BibliographySoftwareNode>;
  status?: Maybe<Scalars['StatusEnum']['output']>;
  tags: TagNodeConnection;
  title: Scalars['String']['output'];
  type: Scalars['TypeEnum']['output'];
};


export type BibliographyNodeAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyId?: InputMaybe<Scalars['ID']['input']>;
  bibliographyId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contactId?: InputMaybe<Scalars['ID']['input']>;
  contactId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institutions?: InputMaybe<Scalars['Decimal']['input']>;
  institutions_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_Gt?: InputMaybe<Scalars['Int']['input']>;
  order_Gte?: InputMaybe<Scalars['Int']['input']>;
  order_Lt?: InputMaybe<Scalars['Int']['input']>;
  order_Lte?: InputMaybe<Scalars['Int']['input']>;
};


export type BibliographyNodeRelatedLabelsArgs = {
  acousticDetectors_Id?: InputMaybe<Scalars['Decimal']['input']>;
  acousticDetectors_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  meanDuration?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gte?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lte?: InputMaybe<Scalars['Float']['input']>;
  minFrequency?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  nickname_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  plurality?: InputMaybe<Scalars['SignalPluralityEnum']['input']>;
  shape?: InputMaybe<Scalars['SignalShapeEnum']['input']>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type BibliographyNodeRelatedProjectsArgs = {
  accessibility?: InputMaybe<Scalars['AccessibilityEnum']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaigns_Id?: InputMaybe<Scalars['Decimal']['input']>;
  campaigns_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  doi?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  financing?: InputMaybe<Scalars['FinancingEnum']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectGoal?: InputMaybe<Scalars['String']['input']>;
  projectGoal_Icontains?: InputMaybe<Scalars['String']['input']>;
  projectType?: InputMaybe<Scalars['Decimal']['input']>;
  projectType_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projectType_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sites_Id?: InputMaybe<Scalars['Decimal']['input']>;
  sites_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lte?: InputMaybe<Scalars['Date']['input']>;
};


export type BibliographyNodeRelatedSoundsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  labels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type BibliographyNodeRelatedSourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  labels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latinName?: InputMaybe<Scalars['String']['input']>;
  latinName_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type BibliographyNodeTagsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type BibliographyNodeConnection = {
  __typename?: 'BibliographyNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<BibliographyNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `BibliographyNode` and its cursor. */
export type BibliographyNodeEdge = {
  __typename?: 'BibliographyNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<BibliographyNode>;
};

export type BibliographyNodeNodeConnection = {
  __typename?: 'BibliographyNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<BibliographyNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type BibliographyPosterNode = Node & {
  __typename?: 'BibliographyPosterNode';
  bibliography?: Maybe<BibliographyNode>;
  id: Scalars['ID']['output'];
  posterUrl?: Maybe<Scalars['String']['output']>;
};

export type BibliographySoftwareNode = Node & {
  __typename?: 'BibliographySoftwareNode';
  bibliography?: Maybe<BibliographyNode>;
  id: Scalars['ID']['output'];
  /** Required for a software */
  publicationPlace: Scalars['String']['output'];
  repositoryUrl?: Maybe<Scalars['String']['output']>;
};

export type CampaignNode = Node & {
  __typename?: 'CampaignNode';
  /** Campaign during which the instrument was deployed. */
  deployments: DeploymentNodeConnection;
  id: Scalars['ID']['output'];
  /** Name of the campaign during which the instrument was deployed. */
  name: Scalars['String']['output'];
  /** Project associated to this campaign */
  project: ProjectNodeOverride;
};


export type CampaignNodeDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  bathymetricDepth?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  campaignId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deploymentDate?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentVessel?: InputMaybe<Scalars['String']['input']>;
  deploymentVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  description_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  mobilePositions_Id?: InputMaybe<Scalars['Decimal']['input']>;
  mobilePositions_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  project_WebsiteProject_Id?: InputMaybe<Scalars['Decimal']['input']>;
  recoveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryVessel?: InputMaybe<Scalars['String']['input']>;
  recoveryVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  siteId?: InputMaybe<Scalars['ID']['input']>;
  siteId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type CampaignNodeConnection = {
  __typename?: 'CampaignNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CampaignNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `CampaignNode` and its cursor. */
export type CampaignNodeEdge = {
  __typename?: 'CampaignNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<CampaignNode>;
};

export type CampaignNodeNodeConnection = {
  __typename?: 'CampaignNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<CampaignNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type ChannelConfigurationDetectorSpecificationNode = Node & {
  __typename?: 'ChannelConfigurationDetectorSpecificationNode';
  channelConfiguration?: Maybe<ChannelConfigurationNode>;
  configuration?: Maybe<Scalars['String']['output']>;
  detector: EquipmentNode;
  filter?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  labels: LabelNodeConnection;
  /** Maximum frequency (in Hertz). */
  maxFrequency?: Maybe<Scalars['Int']['output']>;
  /** Minimum frequency (in Hertz). */
  minFrequency?: Maybe<Scalars['Int']['output']>;
  outputFormats: FileFormatNodeConnection;
};


export type ChannelConfigurationDetectorSpecificationNodeLabelsArgs = {
  acousticDetectors_Id?: InputMaybe<Scalars['Decimal']['input']>;
  acousticDetectors_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  meanDuration?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gte?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lte?: InputMaybe<Scalars['Float']['input']>;
  minFrequency?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  nickname_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  plurality?: InputMaybe<Scalars['SignalPluralityEnum']['input']>;
  shape?: InputMaybe<Scalars['SignalShapeEnum']['input']>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ChannelConfigurationDetectorSpecificationNodeOutputFormatsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationRecorderSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationRecorderSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  files_Id?: InputMaybe<Scalars['Decimal']['input']>;
  files_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ChannelConfigurationDetectorSpecificationNodeConnection = {
  __typename?: 'ChannelConfigurationDetectorSpecificationNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ChannelConfigurationDetectorSpecificationNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ChannelConfigurationDetectorSpecificationNode` and its cursor. */
export type ChannelConfigurationDetectorSpecificationNodeEdge = {
  __typename?: 'ChannelConfigurationDetectorSpecificationNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ChannelConfigurationDetectorSpecificationNode>;
};

export type ChannelConfigurationDetectorSpecificationNodeNodeConnection = {
  __typename?: 'ChannelConfigurationDetectorSpecificationNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<ChannelConfigurationDetectorSpecificationNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type ChannelConfigurationNode = Node & {
  __typename?: 'ChannelConfigurationNode';
  /** Boolean indicating if the record is continuous (1) or has a duty cycle (0). */
  continuous?: Maybe<Scalars['Boolean']['output']>;
  datasets: DatasetNodeConnection;
  deployment: DeploymentNode;
  /** Each specification is dedicated to one file. */
  detectorSpecification?: Maybe<ChannelConfigurationDetectorSpecificationNode>;
  /** If it's not Continuous, time length (in second) during which the recorder is off. */
  dutyCycleOff?: Maybe<Scalars['Int']['output']>;
  /** If it's not Continuous, time length (in second) during which the recorder is on. */
  dutyCycleOn?: Maybe<Scalars['Int']['output']>;
  extraInformation?: Maybe<Scalars['String']['output']>;
  files: FileNodeConnection;
  /** Harvest stop date at which the channel configuration finished to record in (in UTC). */
  harvestEndingDate?: Maybe<Scalars['DateTime']['output']>;
  /** Harvest start date at which the channel configuration was idle to record (in UTC). */
  harvestStartingDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  /** Immersion depth of instrument (in positive meters). */
  instrumentDepth?: Maybe<Scalars['Int']['output']>;
  /** Each specification is dedicated to one file. */
  recorderSpecification?: Maybe<ChannelConfigurationRecorderSpecificationNode>;
  storages: EquipmentNodeConnection;
  timezone?: Maybe<Scalars['String']['output']>;
};


export type ChannelConfigurationNodeDatasetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
};


export type ChannelConfigurationNodeFilesArgs = {
  accessibility?: InputMaybe<Scalars['AccessibilityEnum']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  audioPropertiesId?: InputMaybe<Scalars['ID']['input']>;
  audioPropertiesId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectionPropertiesId?: InputMaybe<Scalars['ID']['input']>;
  detectionPropertiesId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  fileSize?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Gt?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Gte?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Lt?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Lte?: InputMaybe<Scalars['BigInt']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  storageLocation?: InputMaybe<Scalars['String']['input']>;
  storageLocation_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type ChannelConfigurationNodeStoragesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationHydrophoneSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationHydrophoneSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationRecorderSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationRecorderSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  maintenances_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  modelId?: InputMaybe<Scalars['ID']['input']>;
  modelId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  purchaseDate?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  sensitivity?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gte?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Lt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Lte?: InputMaybe<Scalars['Float']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  serialNumber_Icontains?: InputMaybe<Scalars['String']['input']>;
};

export type ChannelConfigurationNodeConnection = {
  __typename?: 'ChannelConfigurationNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ChannelConfigurationNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ChannelConfigurationNode` and its cursor. */
export type ChannelConfigurationNodeEdge = {
  __typename?: 'ChannelConfigurationNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ChannelConfigurationNode>;
};

export type ChannelConfigurationNodeNodeConnection = {
  __typename?: 'ChannelConfigurationNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<ChannelConfigurationNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type ChannelConfigurationRecorderSpecificationNode = Node & {
  __typename?: 'ChannelConfigurationRecorderSpecificationNode';
  channelConfiguration?: Maybe<ChannelConfigurationNode>;
  /** Name of the channel used for recording. */
  channelName?: Maybe<Scalars['String']['output']>;
  /** Gain of the channel (recorder), with correction factors if applicable, without hydrophone sensibility (in dB). If end-to-end calibration with hydrophone sensibility, set it in Sensitivity and set Gain to 0 dB.<br>Gain G of the channel such that : data(uPa) = data(volt)*10^((-Sh-G)/20). See Sensitivity for Sh definition. */
  gain: Scalars['Float']['output'];
  hydrophone: EquipmentNode;
  id: Scalars['ID']['output'];
  recorder: EquipmentNode;
  recordingFormats: FileFormatNodeConnection;
  /** Number of quantization bits used to represent each sample by the recorder channel (in bits). */
  sampleDepth: Scalars['Int']['output'];
  /** Sampling frequency of the recording channel (in Hertz). */
  samplingFrequency: Scalars['Int']['output'];
};


export type ChannelConfigurationRecorderSpecificationNodeRecordingFormatsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationRecorderSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationRecorderSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  files_Id?: InputMaybe<Scalars['Decimal']['input']>;
  files_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ChannelConfigurationRecorderSpecificationNodeConnection = {
  __typename?: 'ChannelConfigurationRecorderSpecificationNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ChannelConfigurationRecorderSpecificationNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ChannelConfigurationRecorderSpecificationNode` and its cursor. */
export type ChannelConfigurationRecorderSpecificationNodeEdge = {
  __typename?: 'ChannelConfigurationRecorderSpecificationNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ChannelConfigurationRecorderSpecificationNode>;
};

export type ChannelConfigurationRecorderSpecificationNodeNodeConnection = {
  __typename?: 'ChannelConfigurationRecorderSpecificationNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<ChannelConfigurationRecorderSpecificationNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** Colormap schema */
export type ColormapNode = ExtendedInterface & {
  __typename?: 'ColormapNode';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  spectrogramAnalysis: SpectrogramAnalysisNodeConnection;
};


/** Colormap schema */
export type ColormapNodeSpectrogramAnalysisArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaigns_Id?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
};

/** Confidence schema */
export type ConfidenceNode = ExtendedInterface & {
  __typename?: 'ConfidenceNode';
  annotationSet: AnnotationNodeConnection;
  confidenceIndicatorSets: ConfidenceSetNodeConnection;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isDefault?: Maybe<Scalars['Boolean']['output']>;
  label: Scalars['String']['output'];
  level: Scalars['Int']['output'];
};


/** Confidence schema */
export type ConfidenceNodeAnnotationSetArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Confidence schema */
export type ConfidenceNodeConfidenceIndicatorSetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidenceIndicators?: InputMaybe<Scalars['ID']['input']>;
  desc?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** ConfidenceSet schema */
export type ConfidenceSetNode = ExtendedInterface & {
  __typename?: 'ConfidenceSetNode';
  annotationcampaignSet: AnnotationCampaignNodeConnection;
  confidenceIndicators?: Maybe<Array<Maybe<ConfidenceNode>>>;
  desc?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};


/** ConfidenceSet schema */
export type ConfidenceSetNodeAnnotationcampaignSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  phases_AnnotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  phases_Phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ConfidenceSetNodeConnection = {
  __typename?: 'ConfidenceSetNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ConfidenceSetNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ConfidenceSetNode` and its cursor. */
export type ConfidenceSetNodeEdge = {
  __typename?: 'ConfidenceSetNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ConfidenceSetNode>;
};

export type ConfidenceSetNodeNodeConnection = {
  __typename?: 'ConfidenceSetNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<ConfidenceSetNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type ContactNode = Node & {
  __typename?: 'ContactNode';
  authors: AuthorNodeConnection;
  currentInstitutions: InstitutionNodeConnection;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  mail?: Maybe<Scalars['String']['output']>;
  performedMaintenances: MaintenanceNodeConnection;
  roles: ContactRoleNodeConnection;
  website?: Maybe<Scalars['String']['output']>;
};


export type ContactNodeAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyId?: InputMaybe<Scalars['ID']['input']>;
  bibliographyId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contactId?: InputMaybe<Scalars['ID']['input']>;
  contactId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institutions?: InputMaybe<Scalars['Decimal']['input']>;
  institutions_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_Gt?: InputMaybe<Scalars['Int']['input']>;
  order_Gte?: InputMaybe<Scalars['Int']['input']>;
  order_Lt?: InputMaybe<Scalars['Int']['input']>;
  order_Lte?: InputMaybe<Scalars['Int']['input']>;
};


export type ContactNodeCurrentInstitutionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyAuthors_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownedEquipments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  ownedPlatforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  performedMaintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  providedEquipments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  providedPlatforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  roles_Id?: InputMaybe<Scalars['Decimal']['input']>;
};


export type ContactNodePerformedMaintenancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  date_Gt?: InputMaybe<Scalars['Date']['input']>;
  date_Gte?: InputMaybe<Scalars['Date']['input']>;
  date_Lt?: InputMaybe<Scalars['Date']['input']>;
  date_Lte?: InputMaybe<Scalars['Date']['input']>;
  equipmentId?: InputMaybe<Scalars['ID']['input']>;
  equipmentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintainerId?: InputMaybe<Scalars['ID']['input']>;
  maintainerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  maintainerInstitutionId?: InputMaybe<Scalars['ID']['input']>;
  maintainerInstitutionId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  typeId?: InputMaybe<Scalars['ID']['input']>;
  typeId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ContactNodeRolesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contact_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contact_LastName?: InputMaybe<Scalars['String']['input']>;
  contact_LastName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Mail?: InputMaybe<Scalars['String']['input']>;
  contact_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Website?: InputMaybe<Scalars['String']['input']>;
  contact_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Id?: InputMaybe<Scalars['Decimal']['input']>;
  institution_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Mail?: InputMaybe<Scalars['String']['input']>;
  institution_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Name?: InputMaybe<Scalars['String']['input']>;
  institution_Name_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Website?: InputMaybe<Scalars['String']['input']>;
  institution_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projects_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projects_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  role?: InputMaybe<Scalars['RoleEnum']['input']>;
};

export type ContactNodeConnection = {
  __typename?: 'ContactNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ContactNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ContactNode` and its cursor. */
export type ContactNodeEdge = {
  __typename?: 'ContactNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ContactNode>;
};

export type ContactNodeNodeConnection = {
  __typename?: 'ContactNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<ContactNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type ContactRoleNode = Node & {
  __typename?: 'ContactRoleNode';
  contact?: Maybe<ContactNode>;
  /** Contacts related to the deployment. */
  deployments: DeploymentNodeConnection;
  id: Scalars['ID']['output'];
  institution?: Maybe<InstitutionNode>;
  /** Should have at least one 'Main Contact' */
  projects: ProjectNodeOverrideConnection;
  role?: Maybe<Scalars['RoleEnum']['output']>;
};


export type ContactRoleNodeDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  bathymetricDepth?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  campaignId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deploymentDate?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentVessel?: InputMaybe<Scalars['String']['input']>;
  deploymentVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  description_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  mobilePositions_Id?: InputMaybe<Scalars['Decimal']['input']>;
  mobilePositions_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  project_WebsiteProject_Id?: InputMaybe<Scalars['Decimal']['input']>;
  recoveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryVessel?: InputMaybe<Scalars['String']['input']>;
  recoveryVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  siteId?: InputMaybe<Scalars['ID']['input']>;
  siteId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ContactRoleNodeProjectsArgs = {
  accessibility?: InputMaybe<Scalars['AccessibilityEnum']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaigns_Id?: InputMaybe<Scalars['Decimal']['input']>;
  campaigns_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  doi?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  financing?: InputMaybe<Scalars['FinancingEnum']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectGoal?: InputMaybe<Scalars['String']['input']>;
  projectGoal_Icontains?: InputMaybe<Scalars['String']['input']>;
  projectType?: InputMaybe<Scalars['Decimal']['input']>;
  projectType_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projectType_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sites_Id?: InputMaybe<Scalars['Decimal']['input']>;
  sites_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lte?: InputMaybe<Scalars['Date']['input']>;
};

export type ContactRoleNodeConnection = {
  __typename?: 'ContactRoleNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ContactRoleNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ContactRoleNode` and its cursor. */
export type ContactRoleNodeEdge = {
  __typename?: 'ContactRoleNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ContactRoleNode>;
};

export type ContactRoleNodeNodeConnection = {
  __typename?: 'ContactRoleNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<ContactRoleNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type CreateAnnotationCampaignMutationInput = {
  allowColormapTuning?: InputMaybe<Scalars['Boolean']['input']>;
  allowImageTuning?: InputMaybe<Scalars['Boolean']['input']>;
  analysis: Array<InputMaybe<Scalars['ID']['input']>>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  colormapDefault?: InputMaybe<Scalars['String']['input']>;
  colormapInvertedDefault?: InputMaybe<Scalars['Boolean']['input']>;
  dataset: Scalars['ID']['input'];
  deadline?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  instructionsUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateAnnotationCampaignMutationPayload = {
  __typename?: 'CreateAnnotationCampaignMutationPayload';
  annotationCampaign?: Maybe<AnnotationCampaignNode>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors: Array<ErrorType>;
};

/** Create annotation phase of type "Verification" mutation */
export type CreateAnnotationPhase = {
  __typename?: 'CreateAnnotationPhase';
  id: Scalars['ID']['output'];
};

/** Dataset schema */
export type DatasetNode = ExtendedInterface & {
  __typename?: 'DatasetNode';
  analysisCount: Scalars['Int']['output'];
  annotationCampaigns: AnnotationCampaignNodeConnection;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  end?: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  legacy: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  owner: UserNode;
  path: Scalars['String']['output'];
  relatedChannelConfigurations: ChannelConfigurationNodeConnection;
  spectrogramAnalysis?: Maybe<SpectrogramAnalysisNodeNodeConnection>;
  spectrogramCount: Scalars['Int']['output'];
  start?: Maybe<Scalars['DateTime']['output']>;
};


/** Dataset schema */
export type DatasetNodeAnnotationCampaignsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  phases_AnnotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  phases_Phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};


/** Dataset schema */
export type DatasetNodeRelatedChannelConfigurationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  continuous?: InputMaybe<Scalars['Boolean']['input']>;
  datasetId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectorSpecification_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  dutyCycleOff?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Gt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Gte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Lt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Lte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Gt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Gte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Lt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Lte?: InputMaybe<Scalars['Int']['input']>;
  files_Id?: InputMaybe<Scalars['Decimal']['input']>;
  files_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  harvestEndingDate?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  instrumentDepth?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  recorderSpecification_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  storages_Id?: InputMaybe<Scalars['Decimal']['input']>;
  storages_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};


/** Dataset schema */
export type DatasetNodeSpectrogramAnalysisArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaigns_Id?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};

export type DatasetNodeConnection = {
  __typename?: 'DatasetNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<DatasetNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `DatasetNode` and its cursor. */
export type DatasetNodeEdge = {
  __typename?: 'DatasetNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<DatasetNode>;
};

export type DatasetNodeNodeConnection = {
  __typename?: 'DatasetNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<DatasetNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type DeleteSoundMutation = {
  __typename?: 'DeleteSoundMutation';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteSourceMutation = {
  __typename?: 'DeleteSourceMutation';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeploymentMobilePositionNode = Node & {
  __typename?: 'DeploymentMobilePositionNode';
  /** Datetime for the mobile platform position */
  datetime: Scalars['DateTime']['output'];
  /** Related deployment */
  deployment: DeploymentNode;
  /** Hydrophone depth of the mobile platform (In positive meters) */
  depth: Scalars['Float']['output'];
  /** Heading of the mobile platform */
  heading?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  /** Latitude of the mobile platform */
  latitude: Scalars['Float']['output'];
  /** Longitude of the mobile platform */
  longitude: Scalars['Float']['output'];
  /** Pitch of the mobile platform */
  pitch?: Maybe<Scalars['Float']['output']>;
  /** Roll of the mobile platform */
  roll?: Maybe<Scalars['Float']['output']>;
};

export type DeploymentMobilePositionNodeConnection = {
  __typename?: 'DeploymentMobilePositionNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<DeploymentMobilePositionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `DeploymentMobilePositionNode` and its cursor. */
export type DeploymentMobilePositionNodeEdge = {
  __typename?: 'DeploymentMobilePositionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<DeploymentMobilePositionNode>;
};

export type DeploymentMobilePositionNodeNodeConnection = {
  __typename?: 'DeploymentMobilePositionNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<DeploymentMobilePositionNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type DeploymentNode = Node & {
  __typename?: 'DeploymentNode';
  /** Underwater depth of ocean floor at the platform position (in positive meters). */
  bathymetricDepth?: Maybe<Scalars['Int']['output']>;
  /** Campaign during which the instrument was deployed. */
  campaign?: Maybe<CampaignNode>;
  channelConfigurations: ChannelConfigurationNodeConnection;
  /** Contacts related to the deployment. */
  contacts: ContactRoleNodeConnection;
  /** Date and time at which the measurement system was deployed in UTC. */
  deploymentDate?: Maybe<Scalars['DateTime']['output']>;
  /** Name of the vehicle associated with the deployment. */
  deploymentVessel?: Maybe<Scalars['String']['output']>;
  /** Optional description of deployment and recovery conditions (weather, technical issues,...). */
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** Latitude of the platform position (WGS84 decimal degrees). */
  latitude: Scalars['Float']['output'];
  /** Longitude of the platform position (WGS84 decimal degree). */
  longitude: Scalars['Float']['output'];
  /** Related deployment */
  mobilePositions: DeploymentMobilePositionNodeConnection;
  /** Name of the deployment. */
  name?: Maybe<Scalars['String']['output']>;
  /** Support of the deployed instruments */
  platform?: Maybe<PlatformNode>;
  /** Project associated to this deployment */
  project: ProjectNodeOverride;
  /** Date and time at which the measurement system was recovered in UTC. */
  recoveryDate?: Maybe<Scalars['DateTime']['output']>;
  /** Name of the vehicle associated with the recovery. */
  recoveryVessel?: Maybe<Scalars['String']['output']>;
  /** Conceptual location. A site may group together several platforms in relatively close proximity, or describes a location where regular deployments are carried out. */
  site?: Maybe<SiteNode>;
};


export type DeploymentNodeChannelConfigurationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  continuous?: InputMaybe<Scalars['Boolean']['input']>;
  datasetId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectorSpecification_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  dutyCycleOff?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Gt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Gte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Lt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Lte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Gt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Gte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Lt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Lte?: InputMaybe<Scalars['Int']['input']>;
  files_Id?: InputMaybe<Scalars['Decimal']['input']>;
  files_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  harvestEndingDate?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  instrumentDepth?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  recorderSpecification_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  storages_Id?: InputMaybe<Scalars['Decimal']['input']>;
  storages_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};


export type DeploymentNodeContactsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contact_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contact_LastName?: InputMaybe<Scalars['String']['input']>;
  contact_LastName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Mail?: InputMaybe<Scalars['String']['input']>;
  contact_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Website?: InputMaybe<Scalars['String']['input']>;
  contact_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Id?: InputMaybe<Scalars['Decimal']['input']>;
  institution_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Mail?: InputMaybe<Scalars['String']['input']>;
  institution_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Name?: InputMaybe<Scalars['String']['input']>;
  institution_Name_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Website?: InputMaybe<Scalars['String']['input']>;
  institution_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projects_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projects_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  role?: InputMaybe<Scalars['RoleEnum']['input']>;
};


export type DeploymentNodeMobilePositionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  datetime?: InputMaybe<Scalars['DateTime']['input']>;
  datetime_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  datetime_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  datetime_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  datetime_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  depth?: InputMaybe<Scalars['Float']['input']>;
  depth_Gt?: InputMaybe<Scalars['Float']['input']>;
  depth_Gte?: InputMaybe<Scalars['Float']['input']>;
  depth_Lt?: InputMaybe<Scalars['Float']['input']>;
  depth_Lte?: InputMaybe<Scalars['Float']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  heading?: InputMaybe<Scalars['Float']['input']>;
  heading_Gt?: InputMaybe<Scalars['Float']['input']>;
  heading_Gte?: InputMaybe<Scalars['Float']['input']>;
  heading_Lt?: InputMaybe<Scalars['Float']['input']>;
  heading_Lte?: InputMaybe<Scalars['Float']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  pitch?: InputMaybe<Scalars['Float']['input']>;
  pitch_Gt?: InputMaybe<Scalars['Float']['input']>;
  pitch_Gte?: InputMaybe<Scalars['Float']['input']>;
  pitch_Lt?: InputMaybe<Scalars['Float']['input']>;
  pitch_Lte?: InputMaybe<Scalars['Float']['input']>;
  roll?: InputMaybe<Scalars['Float']['input']>;
  roll_Gt?: InputMaybe<Scalars['Float']['input']>;
  roll_Gte?: InputMaybe<Scalars['Float']['input']>;
  roll_Lt?: InputMaybe<Scalars['Float']['input']>;
  roll_Lte?: InputMaybe<Scalars['Float']['input']>;
};

export type DeploymentNodeConnection = {
  __typename?: 'DeploymentNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<DeploymentNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `DeploymentNode` and its cursor. */
export type DeploymentNodeEdge = {
  __typename?: 'DeploymentNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<DeploymentNode>;
};

export type DeploymentNodeNodeConnection = {
  __typename?: 'DeploymentNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<DeploymentNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type DetectionPropertiesNode = Node & {
  __typename?: 'DetectionPropertiesNode';
  /** End of the detection file covering (in UTC). */
  end: Scalars['DateTime']['output'];
  file?: Maybe<FileNode>;
  id: Scalars['ID']['output'];
  /** Start of the detection file covering (in UTC). */
  start: Scalars['DateTime']['output'];
};

export type DetectionPropertiesNodeNodeConnection = {
  __typename?: 'DetectionPropertiesNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<DetectionPropertiesNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** DetectorConfiguration schema */
export type DetectorConfigurationNode = ExtendedInterface & {
  __typename?: 'DetectorConfigurationNode';
  annotations: AnnotationNodeConnection;
  configuration: Scalars['String']['output'];
  detector: DetectorNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
};


/** DetectorConfiguration schema */
export type DetectorConfigurationNodeAnnotationsArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Detector schema */
export type DetectorNode = ExtendedInterface & {
  __typename?: 'DetectorNode';
  configurations?: Maybe<Array<Maybe<DetectorConfigurationNode>>>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  specification?: Maybe<AcousticDetectorSpecificationNode>;
};

export type DetectorNodeConnection = {
  __typename?: 'DetectorNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<DetectorNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `DetectorNode` and its cursor. */
export type DetectorNodeEdge = {
  __typename?: 'DetectorNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<DetectorNode>;
};

export type DetectorNodeNodeConnection = {
  __typename?: 'DetectorNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<DetectorNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** Debugging information for the current query. */
export type DjangoDebug = {
  __typename?: 'DjangoDebug';
  /** Raise exceptions for this API query. */
  exceptions?: Maybe<Array<Maybe<DjangoDebugException>>>;
  /** Executed SQL queries for this API query. */
  sql?: Maybe<Array<Maybe<DjangoDebugSql>>>;
};

/** Represents a single exception raised. */
export type DjangoDebugException = {
  __typename?: 'DjangoDebugException';
  /** The class of the exception */
  excType: Scalars['String']['output'];
  /** The message of the exception */
  message: Scalars['String']['output'];
  /** The stack trace */
  stack: Scalars['String']['output'];
};

/** Represents a single database query made to a Django managed DB. */
export type DjangoDebugSql = {
  __typename?: 'DjangoDebugSQL';
  /** The Django database alias (e.g. 'default'). */
  alias: Scalars['String']['output'];
  /** Duration of this database query in seconds. */
  duration: Scalars['Float']['output'];
  /** Postgres connection encoding if available. */
  encoding?: Maybe<Scalars['String']['output']>;
  /** Whether this database query was a SELECT. */
  isSelect: Scalars['Boolean']['output'];
  /** Whether this database query took more than 10 seconds. */
  isSlow: Scalars['Boolean']['output'];
  /** Postgres isolation level if available. */
  isoLevel?: Maybe<Scalars['String']['output']>;
  /** JSON encoded database query parameters. */
  params: Scalars['String']['output'];
  /** The raw SQL of this query, without params. */
  rawSql: Scalars['String']['output'];
  /** The actual SQL sent to this database. */
  sql?: Maybe<Scalars['String']['output']>;
  /** Start time of this database query. */
  startTime: Scalars['Float']['output'];
  /** Stop time of this database query. */
  stopTime: Scalars['Float']['output'];
  /** Postgres transaction ID if available. */
  transId?: Maybe<Scalars['String']['output']>;
  /** Postgres transaction status if available. */
  transStatus?: Maybe<Scalars['String']['output']>;
  /** The type of database being used (e.g. postrgesql, mysql, sqlite). */
  vendor: Scalars['String']['output'];
};

/** Archive annotation phase mutation */
export type EndAnnotationPhaseMutation = {
  __typename?: 'EndAnnotationPhaseMutation';
  ok: Scalars['Boolean']['output'];
};

export type EquipmentModelNode = Node & {
  __typename?: 'EquipmentModelNode';
  batterySlotsCount?: Maybe<Scalars['Int']['output']>;
  batteryType?: Maybe<Scalars['String']['output']>;
  cables?: Maybe<Scalars['String']['output']>;
  equipments: EquipmentNodeConnection;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  provider: InstitutionNode;
};


export type EquipmentModelNodeEquipmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationHydrophoneSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationHydrophoneSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationRecorderSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationRecorderSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  maintenances_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  modelId?: InputMaybe<Scalars['ID']['input']>;
  modelId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  purchaseDate?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  sensitivity?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gte?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Lt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Lte?: InputMaybe<Scalars['Float']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  serialNumber_Icontains?: InputMaybe<Scalars['String']['input']>;
};

export type EquipmentModelNodeConnection = {
  __typename?: 'EquipmentModelNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EquipmentModelNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `EquipmentModelNode` and its cursor. */
export type EquipmentModelNodeEdge = {
  __typename?: 'EquipmentModelNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<EquipmentModelNode>;
};

export type EquipmentModelNodeNodeConnection = {
  __typename?: 'EquipmentModelNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<EquipmentModelNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type EquipmentNode = Node & {
  __typename?: 'EquipmentNode';
  channelConfigurationDetectorSpecifications: ChannelConfigurationDetectorSpecificationNodeConnection;
  channelConfigurationHydrophoneSpecifications: ChannelConfigurationRecorderSpecificationNodeConnection;
  channelConfigurationRecorderSpecifications: ChannelConfigurationRecorderSpecificationNodeConnection;
  channelConfigurations: ChannelConfigurationNodeConnection;
  id: Scalars['ID']['output'];
  maintenances: MaintenanceNodeConnection;
  model: EquipmentModelNode;
  name?: Maybe<Scalars['String']['output']>;
  owner: InstitutionNode;
  purchaseDate?: Maybe<Scalars['Date']['output']>;
  /** Required only for hydrophones */
  sensitivity?: Maybe<Scalars['Float']['output']>;
  serialNumber: Scalars['String']['output'];
};


export type EquipmentNodeChannelConfigurationDetectorSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfiguration_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfiguration_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectorId?: InputMaybe<Scalars['ID']['input']>;
  detectorId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  labels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  outputFormats?: InputMaybe<Scalars['String']['input']>;
};


export type EquipmentNodeChannelConfigurationHydrophoneSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfiguration_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfiguration_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hydrophoneId?: InputMaybe<Scalars['ID']['input']>;
  hydrophoneId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  recorderId?: InputMaybe<Scalars['ID']['input']>;
  recorderId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  recordingFormats?: InputMaybe<Scalars['String']['input']>;
};


export type EquipmentNodeChannelConfigurationRecorderSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfiguration_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfiguration_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hydrophoneId?: InputMaybe<Scalars['ID']['input']>;
  hydrophoneId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  recorderId?: InputMaybe<Scalars['ID']['input']>;
  recorderId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  recordingFormats?: InputMaybe<Scalars['String']['input']>;
};


export type EquipmentNodeChannelConfigurationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  continuous?: InputMaybe<Scalars['Boolean']['input']>;
  datasetId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectorSpecification_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  dutyCycleOff?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Gt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Gte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Lt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Lte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Gt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Gte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Lt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Lte?: InputMaybe<Scalars['Int']['input']>;
  files_Id?: InputMaybe<Scalars['Decimal']['input']>;
  files_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  harvestEndingDate?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  instrumentDepth?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  recorderSpecification_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  storages_Id?: InputMaybe<Scalars['Decimal']['input']>;
  storages_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};


export type EquipmentNodeMaintenancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  date_Gt?: InputMaybe<Scalars['Date']['input']>;
  date_Gte?: InputMaybe<Scalars['Date']['input']>;
  date_Lt?: InputMaybe<Scalars['Date']['input']>;
  date_Lte?: InputMaybe<Scalars['Date']['input']>;
  equipmentId?: InputMaybe<Scalars['ID']['input']>;
  equipmentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintainerId?: InputMaybe<Scalars['ID']['input']>;
  maintainerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  maintainerInstitutionId?: InputMaybe<Scalars['ID']['input']>;
  maintainerInstitutionId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  typeId?: InputMaybe<Scalars['ID']['input']>;
  typeId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type EquipmentNodeConnection = {
  __typename?: 'EquipmentNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EquipmentNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `EquipmentNode` and its cursor. */
export type EquipmentNodeEdge = {
  __typename?: 'EquipmentNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<EquipmentNode>;
};

export type EquipmentNodeNodeConnection = {
  __typename?: 'EquipmentNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<EquipmentNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type ErrorType = {
  __typename?: 'ErrorType';
  field: Scalars['String']['output'];
  messages: Array<Scalars['String']['output']>;
};

/** From ExpertiseLevel */
export enum ExpertiseLevelType {
  Average = 'Average',
  Expert = 'Expert',
  Novice = 'Novice'
}

/** For fetching object id instead of Node id */
export type ExtendedInterface = {
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

/** FFT schema */
export type FftNode = ExtendedInterface & {
  __typename?: 'FFTNode';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  legacy: Scalars['Boolean']['output'];
  nfft: Scalars['Int']['output'];
  overlap: Scalars['Decimal']['output'];
  samplingFrequency: Scalars['Int']['output'];
  scaling?: Maybe<Scalars['String']['output']>;
  spectrogramAnalysis: SpectrogramAnalysisNodeConnection;
  windowSize: Scalars['Int']['output'];
};


/** FFT schema */
export type FftNodeSpectrogramAnalysisArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaigns_Id?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
};

export type FileFormatNode = Node & {
  __typename?: 'FileFormatNode';
  channelConfigurationDetectorSpecifications: ChannelConfigurationDetectorSpecificationNodeConnection;
  channelConfigurationRecorderSpecifications: ChannelConfigurationRecorderSpecificationNodeConnection;
  /** Format of the audio file. */
  files: FileNodeConnection;
  id: Scalars['ID']['output'];
  /** Format of the file */
  name: Scalars['String']['output'];
  spectrogramSet: AnnotationSpectrogramNodeConnection;
};


export type FileFormatNodeChannelConfigurationDetectorSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfiguration_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfiguration_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectorId?: InputMaybe<Scalars['ID']['input']>;
  detectorId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  labels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  outputFormats?: InputMaybe<Scalars['String']['input']>;
};


export type FileFormatNodeChannelConfigurationRecorderSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfiguration_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfiguration_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hydrophoneId?: InputMaybe<Scalars['ID']['input']>;
  hydrophoneId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  recorderId?: InputMaybe<Scalars['ID']['input']>;
  recorderId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  recordingFormats?: InputMaybe<Scalars['String']['input']>;
};


export type FileFormatNodeFilesArgs = {
  accessibility?: InputMaybe<Scalars['AccessibilityEnum']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  audioPropertiesId?: InputMaybe<Scalars['ID']['input']>;
  audioPropertiesId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectionPropertiesId?: InputMaybe<Scalars['ID']['input']>;
  detectionPropertiesId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  fileSize?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Gt?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Gte?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Lt?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Lte?: InputMaybe<Scalars['BigInt']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  storageLocation?: InputMaybe<Scalars['String']['input']>;
  storageLocation_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type FileFormatNodeSpectrogramSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaign?: InputMaybe<Scalars['ID']['input']>;
  annotationTasks_Status?: InputMaybe<AnnotationTaskStatus>;
  annotations_AcousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_Annotator?: InputMaybe<Scalars['ID']['input']>;
  annotations_Confidence_Label?: InputMaybe<Scalars['String']['input']>;
  annotations_Detector?: InputMaybe<Scalars['ID']['input']>;
  annotations_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_LabelName?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  end_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  phase?: InputMaybe<AnnotationPhaseType>;
  start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FileFormatNodeConnection = {
  __typename?: 'FileFormatNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FileFormatNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `FileFormatNode` and its cursor. */
export type FileFormatNodeEdge = {
  __typename?: 'FileFormatNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<FileFormatNode>;
};

export type FileFormatNodeNodeConnection = {
  __typename?: 'FileFormatNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<FileFormatNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type FileNode = Node & {
  __typename?: 'FileNode';
  accessibility?: Maybe<Scalars['AccessibilityEnum']['output']>;
  /** Each property is dedicated to one file. */
  audioProperties?: Maybe<AudioPropertiesNode>;
  channelConfigurations: ChannelConfigurationNodeConnection;
  /** Each property is dedicated to one file. */
  detectionProperties?: Maybe<DetectionPropertiesNode>;
  /** Total number of bytes of the audio file (in bytes). */
  fileSize?: Maybe<Scalars['BigInt']['output']>;
  /** Name of the file, with extension. */
  filename: Scalars['String']['output'];
  /** Format of the audio file. */
  format: FileFormatNode;
  id: Scalars['ID']['output'];
  /** Description of the path to access the data. */
  storageLocation?: Maybe<Scalars['String']['output']>;
};


export type FileNodeChannelConfigurationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  continuous?: InputMaybe<Scalars['Boolean']['input']>;
  datasetId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectorSpecification_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  dutyCycleOff?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Gt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Gte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Lt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Lte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Gt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Gte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Lt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Lte?: InputMaybe<Scalars['Int']['input']>;
  files_Id?: InputMaybe<Scalars['Decimal']['input']>;
  files_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  harvestEndingDate?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  instrumentDepth?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  recorderSpecification_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  storages_Id?: InputMaybe<Scalars['Decimal']['input']>;
  storages_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type FileNodeConnection = {
  __typename?: 'FileNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FileNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `FileNode` and its cursor. */
export type FileNodeEdge = {
  __typename?: 'FileNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<FileNode>;
};

export type FileNodeNodeConnection = {
  __typename?: 'FileNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<FileNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type HydrophoneSpecificationNode = Node & {
  __typename?: 'HydrophoneSpecificationNode';
  directivity?: Maybe<Scalars['HydrophoneDirectivityEnum']['output']>;
  id: Scalars['ID']['output'];
  /** Upper limiting frequency within a more or less flat response of the hydrophone, pre-amplification included if applicable. */
  maxBandwidth?: Maybe<Scalars['Float']['output']>;
  /** Highest level which the hydrophone can handle (dB SPL RMS or peak), pre-amplification included if applicable. */
  maxDynamicRange?: Maybe<Scalars['Float']['output']>;
  /** Maximum depth at which hydrophone operates (in positive meters). */
  maxOperatingDepth?: Maybe<Scalars['Float']['output']>;
  /** Lower limiting frequency for a more or less flat response of the hydrophone, pre-amplification included if applicable. */
  minBandwidth?: Maybe<Scalars['Float']['output']>;
  /** Lowest level which the hydrophone can handle (dB SPL RMS or peak), pre-amplification included if applicable. */
  minDynamicRange?: Maybe<Scalars['Float']['output']>;
  /** Minimum depth at which hydrophone operates (in positive meters). */
  minOperatingDepth?: Maybe<Scalars['Float']['output']>;
  /** Self noise of the hydrophone (dB re 1µPa^2/Hz), pre-amplification included if applicable.<br>Average on bandwidth or a fix frequency (generally @5kHz for example). Possibility to 'below sea-state zero' (equivalent to around 30dB @5kHz) could be nice because it is often described like that. */
  noiseFloor?: Maybe<Scalars['Float']['output']>;
  /** Maximal temperature where the hydrophone operates (in degree Celsius) */
  operatingMaxTemperature?: Maybe<Scalars['Float']['output']>;
  /** Minimal temperature where the hydrophone operates (in degree Celsius) */
  operatingMinTemperature?: Maybe<Scalars['Float']['output']>;
};

export type HydrophoneSpecificationNodeNodeConnection = {
  __typename?: 'HydrophoneSpecificationNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<HydrophoneSpecificationNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** "Import spectrogram analysis mutation */
export type ImportAnalysisMutation = {
  __typename?: 'ImportAnalysisMutation';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Type for import dataset */
export type ImportAnalysisNode = {
  __typename?: 'ImportAnalysisNode';
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

/** Import dataset mutation */
export type ImportDatasetMutation = {
  __typename?: 'ImportDatasetMutation';
  ok: Scalars['Boolean']['output'];
};

/** Type for import dataset */
export type ImportDatasetNode = {
  __typename?: 'ImportDatasetNode';
  analysis?: Maybe<Array<Maybe<ImportAnalysisNode>>>;
  legacy?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type InstitutionNode = Node & {
  __typename?: 'InstitutionNode';
  bibliographyAuthors: AuthorNodeConnection;
  city?: Maybe<Scalars['String']['output']>;
  contacts: ContactNodeConnection;
  country?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mail?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  ownedEquipments: EquipmentNodeConnection;
  ownedPlatforms: PlatformNodeConnection;
  performedMaintenances: MaintenanceNodeConnection;
  providedEquipments: EquipmentModelNodeConnection;
  providedPlatforms: PlatformNodeConnection;
  roles: ContactRoleNodeConnection;
  website?: Maybe<Scalars['String']['output']>;
};


export type InstitutionNodeBibliographyAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyId?: InputMaybe<Scalars['ID']['input']>;
  bibliographyId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contactId?: InputMaybe<Scalars['ID']['input']>;
  contactId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institutions?: InputMaybe<Scalars['Decimal']['input']>;
  institutions_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_Gt?: InputMaybe<Scalars['Int']['input']>;
  order_Gte?: InputMaybe<Scalars['Int']['input']>;
  order_Lt?: InputMaybe<Scalars['Int']['input']>;
  order_Lte?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionNodeContactsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownedEquipments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  ownedPlatforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  performedMaintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  providedEquipments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  providedPlatforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  roles_Id?: InputMaybe<Scalars['Decimal']['input']>;
};


export type InstitutionNodeOwnedEquipmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationHydrophoneSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationHydrophoneSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationRecorderSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationRecorderSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  maintenances_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  modelId?: InputMaybe<Scalars['ID']['input']>;
  modelId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  purchaseDate?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  sensitivity?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gte?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Lt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Lte?: InputMaybe<Scalars['Float']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  serialNumber_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type InstitutionNodeOwnedPlatformsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  maintenances_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  providerId?: InputMaybe<Scalars['ID']['input']>;
  providerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type InstitutionNodePerformedMaintenancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  date_Gt?: InputMaybe<Scalars['Date']['input']>;
  date_Gte?: InputMaybe<Scalars['Date']['input']>;
  date_Lt?: InputMaybe<Scalars['Date']['input']>;
  date_Lte?: InputMaybe<Scalars['Date']['input']>;
  equipmentId?: InputMaybe<Scalars['ID']['input']>;
  equipmentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintainerId?: InputMaybe<Scalars['ID']['input']>;
  maintainerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  maintainerInstitutionId?: InputMaybe<Scalars['ID']['input']>;
  maintainerInstitutionId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  typeId?: InputMaybe<Scalars['ID']['input']>;
  typeId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type InstitutionNodeProvidedEquipmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionNodeProvidedPlatformsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  maintenances_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  providerId?: InputMaybe<Scalars['ID']['input']>;
  providerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type InstitutionNodeRolesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contact_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contact_LastName?: InputMaybe<Scalars['String']['input']>;
  contact_LastName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Mail?: InputMaybe<Scalars['String']['input']>;
  contact_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Website?: InputMaybe<Scalars['String']['input']>;
  contact_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Id?: InputMaybe<Scalars['Decimal']['input']>;
  institution_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Mail?: InputMaybe<Scalars['String']['input']>;
  institution_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Name?: InputMaybe<Scalars['String']['input']>;
  institution_Name_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Website?: InputMaybe<Scalars['String']['input']>;
  institution_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projects_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projects_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  role?: InputMaybe<Scalars['RoleEnum']['input']>;
};

export type InstitutionNodeConnection = {
  __typename?: 'InstitutionNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InstitutionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `InstitutionNode` and its cursor. */
export type InstitutionNodeEdge = {
  __typename?: 'InstitutionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<InstitutionNode>;
};

export type InstitutionNodeNodeConnection = {
  __typename?: 'InstitutionNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<InstitutionNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type LabelNode = Node & {
  __typename?: 'LabelNode';
  acousticDetectors: AcousticDetectorSpecificationNodeConnection;
  /** Other name found in the bibliography for this label */
  associatedNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  channelConfigurationDetectorSpecifications: ChannelConfigurationDetectorSpecificationNodeConnection;
  children: LabelNodeConnection;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  labelSet: AnnotationLabelNodeConnection;
  maxFrequency?: Maybe<Scalars['Int']['output']>;
  meanDuration?: Maybe<Scalars['Float']['output']>;
  minFrequency?: Maybe<Scalars['Int']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<LabelNode>;
  plurality?: Maybe<Scalars['SignalPluralityEnum']['output']>;
  relatedBibliography: BibliographyNodeConnection;
  shape?: Maybe<Scalars['SignalShapeEnum']['output']>;
  sound?: Maybe<SoundNode>;
  source: SourceNode;
};


export type LabelNodeAcousticDetectorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  algorithmName?: InputMaybe<Scalars['String']['input']>;
  algorithmName_Icontains?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  detectedLabels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  detectedLabels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type LabelNodeChannelConfigurationDetectorSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfiguration_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfiguration_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectorId?: InputMaybe<Scalars['ID']['input']>;
  detectorId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  labels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  outputFormats?: InputMaybe<Scalars['String']['input']>;
};


export type LabelNodeChildrenArgs = {
  acousticDetectors_Id?: InputMaybe<Scalars['Decimal']['input']>;
  acousticDetectors_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  meanDuration?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gte?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lte?: InputMaybe<Scalars['Float']['input']>;
  minFrequency?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  nickname_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  plurality?: InputMaybe<Scalars['SignalPluralityEnum']['input']>;
  shape?: InputMaybe<Scalars['SignalShapeEnum']['input']>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type LabelNodeLabelSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotation_AnnotationPhase_AnnotationCampaignId?: InputMaybe<Scalars['ID']['input']>;
  annotation_AnnotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotation_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type LabelNodeRelatedBibliographyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['StatusEnum']['input']>;
  tags_Name?: InputMaybe<Scalars['String']['input']>;
  tags_Name_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['TypeEnum']['input']>;
};

export type LabelNodeConnection = {
  __typename?: 'LabelNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LabelNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `LabelNode` and its cursor. */
export type LabelNodeEdge = {
  __typename?: 'LabelNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<LabelNode>;
};

export type LabelNodeNodeConnection = {
  __typename?: 'LabelNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<LabelNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** LabelSet schema */
export type LabelSetNode = ExtendedInterface & {
  __typename?: 'LabelSetNode';
  annotationcampaignSet: AnnotationCampaignNodeConnection;
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  labels: Array<Maybe<AnnotationLabelNode>>;
  name: Scalars['String']['output'];
};


/** LabelSet schema */
export type LabelSetNodeAnnotationcampaignSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  phases_AnnotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  phases_Phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type LabelSetNodeConnection = {
  __typename?: 'LabelSetNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LabelSetNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `LabelSetNode` and its cursor. */
export type LabelSetNodeEdge = {
  __typename?: 'LabelSetNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<LabelSetNode>;
};

export type LabelSetNodeNodeConnection = {
  __typename?: 'LabelSetNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<LabelSetNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** LegacySpectrogramConfiguration schema */
export type LegacySpectrogramConfigurationNode = ExtendedInterface & {
  __typename?: 'LegacySpectrogramConfigurationNode';
  audioFilesSubtypes?: Maybe<Array<Scalars['String']['output']>>;
  channelCount?: Maybe<Scalars['Int']['output']>;
  dataNormalization: Scalars['String']['output'];
  fileOverlap?: Maybe<Scalars['Int']['output']>;
  folder: Scalars['String']['output'];
  frequencyResolution: Scalars['Float']['output'];
  gainDb?: Maybe<Scalars['Float']['output']>;
  hpFilterMinFrequency: Scalars['Int']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  linearFrequencyScale?: Maybe<LinearScaleNode>;
  multiLinearFrequencyScale?: Maybe<MultiLinearScaleNode>;
  peakVoltage?: Maybe<Scalars['Float']['output']>;
  scaleName?: Maybe<Scalars['String']['output']>;
  sensitivityDb?: Maybe<Scalars['Float']['output']>;
  spectrogramAnalysis: SpectrogramAnalysisNode;
  spectrogramNormalization: Scalars['String']['output'];
  temporalResolution?: Maybe<Scalars['Float']['output']>;
  windowType?: Maybe<Scalars['String']['output']>;
  zoomLevel: Scalars['Int']['output'];
  zscoreDuration?: Maybe<Scalars['String']['output']>;
};

export type LegacySpectrogramConfigurationNodeConnection = {
  __typename?: 'LegacySpectrogramConfigurationNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LegacySpectrogramConfigurationNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `LegacySpectrogramConfigurationNode` and its cursor. */
export type LegacySpectrogramConfigurationNodeEdge = {
  __typename?: 'LegacySpectrogramConfigurationNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<LegacySpectrogramConfigurationNode>;
};

/** LinearScale schema */
export type LinearScaleNode = ExtendedInterface & {
  __typename?: 'LinearScaleNode';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  legacyspectrogramconfigurationSet: LegacySpectrogramConfigurationNodeConnection;
  maxValue: Scalars['Float']['output'];
  minValue: Scalars['Float']['output'];
  name?: Maybe<Scalars['String']['output']>;
  outerScales: MultiLinearScaleNodeConnection;
  ratio: Scalars['Float']['output'];
};


/** LinearScale schema */
export type LinearScaleNodeLegacyspectrogramconfigurationSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** LinearScale schema */
export type LinearScaleNodeOuterScalesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type MaintenanceNode = Node & {
  __typename?: 'MaintenanceNode';
  date: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  equipment?: Maybe<EquipmentNode>;
  id: Scalars['ID']['output'];
  maintainer?: Maybe<ContactNode>;
  maintainerInstitution?: Maybe<InstitutionNode>;
  platform?: Maybe<PlatformNode>;
  type: MaintenanceTypeNode;
};

export type MaintenanceNodeConnection = {
  __typename?: 'MaintenanceNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<MaintenanceNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `MaintenanceNode` and its cursor. */
export type MaintenanceNodeEdge = {
  __typename?: 'MaintenanceNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<MaintenanceNode>;
};

export type MaintenanceNodeNodeConnection = {
  __typename?: 'MaintenanceNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<MaintenanceNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type MaintenanceTypeNode = Node & {
  __typename?: 'MaintenanceTypeNode';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interval?: Maybe<Scalars['Float']['output']>;
  maintenances: MaintenanceNodeConnection;
  name: Scalars['String']['output'];
};


export type MaintenanceTypeNodeMaintenancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  date_Gt?: InputMaybe<Scalars['Date']['input']>;
  date_Gte?: InputMaybe<Scalars['Date']['input']>;
  date_Lt?: InputMaybe<Scalars['Date']['input']>;
  date_Lte?: InputMaybe<Scalars['Date']['input']>;
  equipmentId?: InputMaybe<Scalars['ID']['input']>;
  equipmentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintainerId?: InputMaybe<Scalars['ID']['input']>;
  maintainerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  maintainerInstitutionId?: InputMaybe<Scalars['ID']['input']>;
  maintainerInstitutionId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  typeId?: InputMaybe<Scalars['ID']['input']>;
  typeId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type MaintenanceTypeNodeNodeConnection = {
  __typename?: 'MaintenanceTypeNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<MaintenanceTypeNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** MultiLinearScale schema */
export type MultiLinearScaleNode = ExtendedInterface & {
  __typename?: 'MultiLinearScaleNode';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  innerScales?: Maybe<Array<Maybe<LinearScaleNode>>>;
  legacyspectrogramconfigurationSet: LegacySpectrogramConfigurationNodeConnection;
  name?: Maybe<Scalars['String']['output']>;
};


/** MultiLinearScale schema */
export type MultiLinearScaleNodeLegacyspectrogramconfigurationSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type MultiLinearScaleNodeConnection = {
  __typename?: 'MultiLinearScaleNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<MultiLinearScaleNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `MultiLinearScaleNode` and its cursor. */
export type MultiLinearScaleNodeEdge = {
  __typename?: 'MultiLinearScaleNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<MultiLinearScaleNode>;
};

/** Global mutation */
export type Mutation = {
  __typename?: 'Mutation';
  _debug?: Maybe<DjangoDebug>;
  /** Archive annotation campaign mutation */
  archiveAnnotationCampaign?: Maybe<ArchiveAnnotationCampaignMutation>;
  createAnnotationCampaign?: Maybe<CreateAnnotationCampaignMutationPayload>;
  /** Create annotation phase of type "Verification" mutation */
  createAnnotationPhase?: Maybe<CreateAnnotationPhase>;
  /** Update user mutation */
  currentUserUpdate?: Maybe<UpdateUserMutationPayload>;
  deleteSound?: Maybe<DeleteSoundMutation>;
  deleteSource?: Maybe<DeleteSourceMutation>;
  /** Archive annotation phase mutation */
  endAnnotationPhase?: Maybe<EndAnnotationPhaseMutation>;
  /** Import dataset mutation */
  importDataset?: Maybe<ImportDatasetMutation>;
  /** "Import spectrogram analysis mutation */
  importSpectrogramAnalysis?: Maybe<ImportAnalysisMutation>;
  postSound?: Maybe<PostSoundMutationPayload>;
  postSource?: Maybe<PostSourceMutationPayload>;
  submitAnnotationTask?: Maybe<SubmitAnnotationTaskMutation>;
  updateAnnotationCampaign?: Maybe<UpdateAnnotationCampaignMutationPayload>;
  updateAnnotationComments?: Maybe<UpdateAnnotationCommentsMutationPayload>;
  updateAnnotationPhaseFileRanges?: Maybe<UpdateAnnotationPhaseFileRangesMutation>;
  updateAnnotations?: Maybe<UpdateAnnotationsMutationPayload>;
  /** Update password mutation */
  userUpdatePassword?: Maybe<UpdateUserPasswordMutationPayload>;
};


/** Global mutation */
export type MutationArchiveAnnotationCampaignArgs = {
  id: Scalars['ID']['input'];
};


/** Global mutation */
export type MutationCreateAnnotationCampaignArgs = {
  input: CreateAnnotationCampaignMutationInput;
};


/** Global mutation */
export type MutationCreateAnnotationPhaseArgs = {
  campaignId: Scalars['ID']['input'];
  type: AnnotationPhaseType;
};


/** Global mutation */
export type MutationCurrentUserUpdateArgs = {
  input: UpdateUserMutationInput;
};


/** Global mutation */
export type MutationDeleteSoundArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


/** Global mutation */
export type MutationDeleteSourceArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


/** Global mutation */
export type MutationEndAnnotationPhaseArgs = {
  id: Scalars['ID']['input'];
};


/** Global mutation */
export type MutationImportDatasetArgs = {
  legacy?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  path: Scalars['String']['input'];
};


/** Global mutation */
export type MutationImportSpectrogramAnalysisArgs = {
  datasetName: Scalars['String']['input'];
  datasetPath: Scalars['String']['input'];
  legacy?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  path: Scalars['String']['input'];
};


/** Global mutation */
export type MutationPostSoundArgs = {
  input: PostSoundMutationInput;
};


/** Global mutation */
export type MutationPostSourceArgs = {
  input: PostSourceMutationInput;
};


/** Global mutation */
export type MutationSubmitAnnotationTaskArgs = {
  annotations: Array<InputMaybe<AnnotationInput>>;
  campaignId: Scalars['ID']['input'];
  endedAt: Scalars['DateTime']['input'];
  phaseType: AnnotationPhaseType;
  spectrogramId: Scalars['ID']['input'];
  startedAt: Scalars['DateTime']['input'];
  taskComments: Array<InputMaybe<AnnotationCommentInput>>;
};


/** Global mutation */
export type MutationUpdateAnnotationCampaignArgs = {
  input: UpdateAnnotationCampaignMutationInput;
};


/** Global mutation */
export type MutationUpdateAnnotationCommentsArgs = {
  input: UpdateAnnotationCommentsMutationInput;
};


/** Global mutation */
export type MutationUpdateAnnotationPhaseFileRangesArgs = {
  campaignId: Scalars['ID']['input'];
  fileRanges: Array<InputMaybe<AnnotationFileRangeInput>>;
  force?: InputMaybe<Scalars['Boolean']['input']>;
  phaseType: AnnotationPhaseType;
};


/** Global mutation */
export type MutationUpdateAnnotationsArgs = {
  input: UpdateAnnotationsMutationInput;
};


/** Global mutation */
export type MutationUserUpdatePasswordArgs = {
  input: UpdateUserPasswordMutationInput;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PageInfoExtra = {
  __typename?: 'PageInfoExtra';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
};

export type PlatformNode = Node & {
  __typename?: 'PlatformNode';
  /** Support of the deployed instruments */
  deployments: DeploymentNodeConnection;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  maintenances: MaintenanceNodeConnection;
  name?: Maybe<Scalars['String']['output']>;
  owner: InstitutionNode;
  provider: InstitutionNode;
  type: PlatformTypeNode;
};


export type PlatformNodeDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  bathymetricDepth?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  campaignId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deploymentDate?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentVessel?: InputMaybe<Scalars['String']['input']>;
  deploymentVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  description_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  mobilePositions_Id?: InputMaybe<Scalars['Decimal']['input']>;
  mobilePositions_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  project_WebsiteProject_Id?: InputMaybe<Scalars['Decimal']['input']>;
  recoveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryVessel?: InputMaybe<Scalars['String']['input']>;
  recoveryVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  siteId?: InputMaybe<Scalars['ID']['input']>;
  siteId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type PlatformNodeMaintenancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  date_Gt?: InputMaybe<Scalars['Date']['input']>;
  date_Gte?: InputMaybe<Scalars['Date']['input']>;
  date_Lt?: InputMaybe<Scalars['Date']['input']>;
  date_Lte?: InputMaybe<Scalars['Date']['input']>;
  equipmentId?: InputMaybe<Scalars['ID']['input']>;
  equipmentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintainerId?: InputMaybe<Scalars['ID']['input']>;
  maintainerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  maintainerInstitutionId?: InputMaybe<Scalars['ID']['input']>;
  maintainerInstitutionId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  typeId?: InputMaybe<Scalars['ID']['input']>;
  typeId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type PlatformNodeConnection = {
  __typename?: 'PlatformNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PlatformNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `PlatformNode` and its cursor. */
export type PlatformNodeEdge = {
  __typename?: 'PlatformNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<PlatformNode>;
};

export type PlatformNodeNodeConnection = {
  __typename?: 'PlatformNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<PlatformNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type PlatformTypeNode = Node & {
  __typename?: 'PlatformTypeNode';
  id: Scalars['ID']['output'];
  isMobile: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  platforms: PlatformNodeConnection;
};


export type PlatformTypeNodePlatformsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  maintenances_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  providerId?: InputMaybe<Scalars['ID']['input']>;
  providerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type PlatformTypeNodeNodeConnection = {
  __typename?: 'PlatformTypeNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<PlatformTypeNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type PostSoundMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  englishName: Scalars['String']['input'];
  frenchName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  parent?: InputMaybe<Scalars['String']['input']>;
  taxon?: InputMaybe<Scalars['String']['input']>;
};

export type PostSoundMutationPayload = {
  __typename?: 'PostSoundMutationPayload';
  associatedNames?: Maybe<Scalars['String']['output']>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  codeName?: Maybe<Scalars['String']['output']>;
  data?: Maybe<SoundNode>;
  englishName?: Maybe<Scalars['String']['output']>;
  /** May contain more than one error for same field. */
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  frenchName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  parent?: Maybe<Scalars['String']['output']>;
  relatedBibliography?: Maybe<Scalars['String']['output']>;
  taxon?: Maybe<Scalars['String']['output']>;
};

export type PostSourceMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  englishName: Scalars['String']['input'];
  frenchName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  latinName?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['String']['input']>;
  taxon?: InputMaybe<Scalars['String']['input']>;
};

export type PostSourceMutationPayload = {
  __typename?: 'PostSourceMutationPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  codeName?: Maybe<Scalars['String']['output']>;
  data?: Maybe<SourceNode>;
  englishName?: Maybe<Scalars['String']['output']>;
  /** May contain more than one error for same field. */
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  frenchName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  latinName?: Maybe<Scalars['String']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  parent?: Maybe<Scalars['String']['output']>;
  relatedBibliography?: Maybe<Scalars['String']['output']>;
  taxon?: Maybe<Scalars['String']['output']>;
};

export type ProjectNode = Node & {
  __typename?: 'ProjectNode';
  accessibility?: Maybe<Scalars['AccessibilityEnum']['output']>;
  /** Project associated to this campaign */
  campaigns: CampaignNodeConnection;
  /** Should have at least one 'Main Contact' */
  contacts: ContactRoleNodeConnection;
  /** Project associated to this deployment */
  deployments: DeploymentNodeConnection;
  /** Digital Object Identifier of the data, if existing. */
  doi?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Date']['output']>;
  financing?: Maybe<Scalars['FinancingEnum']['output']>;
  id: Scalars['ID']['output'];
  /** Name of the project */
  name: Scalars['String']['output'];
  /** Description of the goal of the project. */
  projectGoal?: Maybe<Scalars['String']['output']>;
  /** Description of the type of the project (e.g., research, marine renewable energies, long monitoring,...). */
  projectType?: Maybe<ProjectTypeNode>;
  relatedBibliography: BibliographyNodeConnection;
  /** Project associated to this site */
  sites: SiteNodeConnection;
  startDate?: Maybe<Scalars['Date']['output']>;
  websiteProject?: Maybe<WebsiteProjectNode>;
};


export type ProjectNodeCampaignsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ProjectNodeContactsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contact_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contact_LastName?: InputMaybe<Scalars['String']['input']>;
  contact_LastName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Mail?: InputMaybe<Scalars['String']['input']>;
  contact_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Website?: InputMaybe<Scalars['String']['input']>;
  contact_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Id?: InputMaybe<Scalars['Decimal']['input']>;
  institution_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Mail?: InputMaybe<Scalars['String']['input']>;
  institution_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Name?: InputMaybe<Scalars['String']['input']>;
  institution_Name_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Website?: InputMaybe<Scalars['String']['input']>;
  institution_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projects_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projects_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  role?: InputMaybe<Scalars['RoleEnum']['input']>;
};


export type ProjectNodeDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  bathymetricDepth?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  campaignId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deploymentDate?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentVessel?: InputMaybe<Scalars['String']['input']>;
  deploymentVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  description_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  mobilePositions_Id?: InputMaybe<Scalars['Decimal']['input']>;
  mobilePositions_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  project_WebsiteProject_Id?: InputMaybe<Scalars['Decimal']['input']>;
  recoveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryVessel?: InputMaybe<Scalars['String']['input']>;
  recoveryVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  siteId?: InputMaybe<Scalars['ID']['input']>;
  siteId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ProjectNodeRelatedBibliographyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['StatusEnum']['input']>;
  tags_Name?: InputMaybe<Scalars['String']['input']>;
  tags_Name_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['TypeEnum']['input']>;
};


export type ProjectNodeSitesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ProjectNodeOverride = Node & {
  __typename?: 'ProjectNodeOverride';
  accessibility?: Maybe<Scalars['AccessibilityEnum']['output']>;
  /** Project associated to this campaign */
  campaigns: CampaignNodeConnection;
  /** Should have at least one 'Main Contact' */
  contacts: ContactRoleNodeConnection;
  /** Project associated to this deployment */
  deployments: DeploymentNodeConnection;
  /** Digital Object Identifier of the data, if existing. */
  doi?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Date']['output']>;
  financing?: Maybe<Scalars['FinancingEnum']['output']>;
  id: Scalars['ID']['output'];
  /** Name of the project */
  name: Scalars['String']['output'];
  /** Description of the goal of the project. */
  projectGoal?: Maybe<Scalars['String']['output']>;
  /** Description of the type of the project (e.g., research, marine renewable energies, long monitoring,...). */
  projectType?: Maybe<ProjectTypeNode>;
  relatedBibliography: BibliographyNodeConnection;
  /** Project associated to this site */
  sites: SiteNodeConnection;
  startDate?: Maybe<Scalars['Date']['output']>;
  websiteProject?: Maybe<WebsiteProjectNode>;
};


export type ProjectNodeOverrideCampaignsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ProjectNodeOverrideContactsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contact_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contact_LastName?: InputMaybe<Scalars['String']['input']>;
  contact_LastName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Mail?: InputMaybe<Scalars['String']['input']>;
  contact_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Website?: InputMaybe<Scalars['String']['input']>;
  contact_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Id?: InputMaybe<Scalars['Decimal']['input']>;
  institution_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Mail?: InputMaybe<Scalars['String']['input']>;
  institution_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Name?: InputMaybe<Scalars['String']['input']>;
  institution_Name_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Website?: InputMaybe<Scalars['String']['input']>;
  institution_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projects_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projects_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  role?: InputMaybe<Scalars['RoleEnum']['input']>;
};


export type ProjectNodeOverrideDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  bathymetricDepth?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  campaignId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deploymentDate?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentVessel?: InputMaybe<Scalars['String']['input']>;
  deploymentVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  description_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  mobilePositions_Id?: InputMaybe<Scalars['Decimal']['input']>;
  mobilePositions_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  project_WebsiteProject_Id?: InputMaybe<Scalars['Decimal']['input']>;
  recoveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryVessel?: InputMaybe<Scalars['String']['input']>;
  recoveryVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  siteId?: InputMaybe<Scalars['ID']['input']>;
  siteId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ProjectNodeOverrideRelatedBibliographyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['StatusEnum']['input']>;
  tags_Name?: InputMaybe<Scalars['String']['input']>;
  tags_Name_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['TypeEnum']['input']>;
};


export type ProjectNodeOverrideSitesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ProjectNodeOverrideConnection = {
  __typename?: 'ProjectNodeOverrideConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProjectNodeOverrideEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ProjectNodeOverride` and its cursor. */
export type ProjectNodeOverrideEdge = {
  __typename?: 'ProjectNodeOverrideEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ProjectNodeOverride>;
};

export type ProjectNodeOverrideNodeConnection = {
  __typename?: 'ProjectNodeOverrideNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<ProjectNodeOverride>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type ProjectTypeNode = Node & {
  __typename?: 'ProjectTypeNode';
  id: Scalars['ID']['output'];
  /** Description of the type of the project */
  name: Scalars['String']['output'];
  /** Description of the type of the project (e.g., research, marine renewable energies, long monitoring,...). */
  projects: ProjectNodeOverrideConnection;
};


export type ProjectTypeNodeProjectsArgs = {
  accessibility?: InputMaybe<Scalars['AccessibilityEnum']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaigns_Id?: InputMaybe<Scalars['Decimal']['input']>;
  campaigns_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  doi?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  financing?: InputMaybe<Scalars['FinancingEnum']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectGoal?: InputMaybe<Scalars['String']['input']>;
  projectGoal_Icontains?: InputMaybe<Scalars['String']['input']>;
  projectType?: InputMaybe<Scalars['Decimal']['input']>;
  projectType_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projectType_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sites_Id?: InputMaybe<Scalars['Decimal']['input']>;
  sites_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lte?: InputMaybe<Scalars['Date']['input']>;
};

export type ProjectTypeNodeNodeConnection = {
  __typename?: 'ProjectTypeNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<ProjectTypeNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** Global query */
export type Query = {
  __typename?: 'Query';
  _debug?: Maybe<DjangoDebug>;
  acousticDetectorSpecificationById?: Maybe<AcousticDetectorSpecificationNode>;
  allAcousticDetectorSpecifications?: Maybe<AcousticDetectorSpecificationNodeNodeConnection>;
  allAnalysisForImport?: Maybe<Array<Maybe<ImportAnalysisNode>>>;
  allAnnotationCampaigns?: Maybe<AnnotationCampaignNodeNodeConnection>;
  allAnnotationFileRanges?: Maybe<AnnotationFileRangeNodeNodeConnection>;
  allAnnotationPhases?: Maybe<AnnotationPhaseNodeNodeConnection>;
  allAnnotationSpectrograms?: Maybe<AnnotationSpectrogramNodeNodeConnection>;
  allAudioProperties?: Maybe<AudioPropertiesNodeNodeConnection>;
  allAuthors?: Maybe<AuthorNodeNodeConnection>;
  allBibliography?: Maybe<BibliographyNodeNodeConnection>;
  allCampaigns?: Maybe<CampaignNodeNodeConnection>;
  allChannelConfigurations?: Maybe<ChannelConfigurationNodeNodeConnection>;
  allChannelConfigurationsDetectorSpecifications?: Maybe<ChannelConfigurationDetectorSpecificationNodeNodeConnection>;
  allChannelConfigurationsRecorderSpecifications?: Maybe<ChannelConfigurationRecorderSpecificationNodeNodeConnection>;
  allConfidenceSets?: Maybe<ConfidenceSetNodeNodeConnection>;
  allContactRoles?: Maybe<ContactRoleNodeNodeConnection>;
  allContacts?: Maybe<ContactNodeNodeConnection>;
  allDatasets?: Maybe<DatasetNodeNodeConnection>;
  allDatasetsForImport?: Maybe<Array<Maybe<ImportDatasetNode>>>;
  allDeploymentMobilePositions?: Maybe<DeploymentMobilePositionNodeNodeConnection>;
  allDeployments?: Maybe<DeploymentNodeNodeConnection>;
  allDetectionProperties?: Maybe<DetectionPropertiesNodeNodeConnection>;
  allDetectors?: Maybe<DetectorNodeNodeConnection>;
  allEquipmentModels?: Maybe<EquipmentModelNodeNodeConnection>;
  allEquipments?: Maybe<EquipmentNodeNodeConnection>;
  allFile?: Maybe<FileNodeNodeConnection>;
  allFileFormats?: Maybe<FileFormatNodeNodeConnection>;
  allHydrophoneSpecifications?: Maybe<HydrophoneSpecificationNodeNodeConnection>;
  allInstitutions?: Maybe<InstitutionNodeNodeConnection>;
  allLabelSets?: Maybe<LabelSetNodeNodeConnection>;
  allLabels?: Maybe<LabelNodeNodeConnection>;
  allMaintenanceTypes?: Maybe<MaintenanceTypeNodeNodeConnection>;
  allMaintenances?: Maybe<MaintenanceNodeNodeConnection>;
  allPlatformTypes?: Maybe<PlatformTypeNodeNodeConnection>;
  allPlatforms?: Maybe<PlatformNodeNodeConnection>;
  allProjectTypes?: Maybe<ProjectTypeNodeNodeConnection>;
  allProjects?: Maybe<ProjectNodeOverrideNodeConnection>;
  allRecorderSpecifications?: Maybe<RecorderSpecificationNodeNodeConnection>;
  allSites?: Maybe<SiteNodeNodeConnection>;
  allSounds?: Maybe<SoundNodeNodeConnection>;
  allSources?: Maybe<SourceNodeNodeConnection>;
  allSpectrogramAnalysis?: Maybe<SpectrogramAnalysisNodeNodeConnection>;
  allStorageSpecifications?: Maybe<StorageSpecificationNodeNodeConnection>;
  allTags?: Maybe<TagNodeNodeConnection>;
  allUserGroups?: Maybe<UserGroupNodeNodeConnection>;
  allUsers?: Maybe<UserNodeNodeConnection>;
  allWebsiteProjects?: Maybe<WebsiteProjectNodeNodeConnection>;
  annotationCampaignById?: Maybe<AnnotationCampaignNode>;
  annotationLabelsForDeploymentId?: Maybe<AnnotationLabelNodeNodeConnection>;
  annotationPhaseByCampaignPhase?: Maybe<AnnotationPhaseNode>;
  annotationSpectrogramById?: Maybe<AnnotationSpectrogramNode>;
  audioPropertyById?: Maybe<AudioPropertiesNode>;
  authorById?: Maybe<AuthorNode>;
  bibliographyArticleById?: Maybe<BibliographyArticleNode>;
  bibliographyById?: Maybe<BibliographyNode>;
  bibliographyConferenceById?: Maybe<BibliographyConferenceNode>;
  bibliographyPosterById?: Maybe<BibliographyPosterNode>;
  bibliographySoftwareById?: Maybe<BibliographySoftwareNode>;
  campaignById?: Maybe<CampaignNode>;
  channelConfigurationById?: Maybe<ChannelConfigurationNode>;
  channelConfigurationDetectorSpecificationById?: Maybe<ChannelConfigurationDetectorSpecificationNode>;
  channelConfigurationRecorderSpecificationById?: Maybe<ChannelConfigurationRecorderSpecificationNode>;
  contactById?: Maybe<ContactNode>;
  contactRoleById?: Maybe<ContactRoleNode>;
  currentUser?: Maybe<UserNode>;
  datasetById?: Maybe<DatasetNode>;
  deploymentById?: Maybe<DeploymentNode>;
  deploymentMobilePositionById?: Maybe<DeploymentMobilePositionNode>;
  detectionPropertyById?: Maybe<DetectionPropertiesNode>;
  equipmentById?: Maybe<EquipmentNode>;
  fileById?: Maybe<FileNode>;
  fileFormatById?: Maybe<FileFormatNode>;
  hydrophoneSpecificationById?: Maybe<HydrophoneSpecificationNode>;
  institutionById?: Maybe<InstitutionNode>;
  labelById?: Maybe<LabelNode>;
  maintenanceById?: Maybe<MaintenanceNode>;
  maintenanceTypeById?: Maybe<MaintenanceTypeNode>;
  platformById?: Maybe<PlatformNode>;
  platformTypeById?: Maybe<PlatformTypeNode>;
  projectById?: Maybe<ProjectNode>;
  projectTypeById?: Maybe<ProjectTypeNode>;
  recorderSpecificationById?: Maybe<RecorderSpecificationNode>;
  siteById?: Maybe<SiteNode>;
  soundById?: Maybe<SoundNode>;
  sourceById?: Maybe<SourceNode>;
  storageSpecificationById?: Maybe<StorageSpecificationNode>;
  tagById?: Maybe<TagNode>;
  websiteProjetById?: Maybe<WebsiteProjectNode>;
};


/** Global query */
export type QueryAcousticDetectorSpecificationByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryAllAcousticDetectorSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  algorithmName?: InputMaybe<Scalars['String']['input']>;
  algorithmName_Icontains?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  detectedLabels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  detectedLabels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllAnalysisForImportArgs = {
  datasetId: Scalars['ID']['input'];
};


/** Global query */
export type QueryAllAnnotationCampaignsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  phases_AnnotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  phases_Phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllAnnotationFileRangesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationPhase_AnnotationCampaign?: InputMaybe<Scalars['ID']['input']>;
  annotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllAnnotationPhasesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaignId?: InputMaybe<Scalars['ID']['input']>;
  annotationCampaign_OwnerId?: InputMaybe<Scalars['ID']['input']>;
  annotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isCampaignArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllAnnotationSpectrogramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaign?: InputMaybe<Scalars['ID']['input']>;
  annotationTasks_Status?: InputMaybe<AnnotationTaskStatus>;
  annotations_AcousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_Annotator?: InputMaybe<Scalars['ID']['input']>;
  annotations_Confidence_Label?: InputMaybe<Scalars['String']['input']>;
  annotations_Detector?: InputMaybe<Scalars['ID']['input']>;
  annotations_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_LabelName?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  end_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  phase?: InputMaybe<AnnotationPhaseType>;
  start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


/** Global query */
export type QueryAllAudioPropertiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  duration_Gt?: InputMaybe<Scalars['Int']['input']>;
  duration_Gte?: InputMaybe<Scalars['Int']['input']>;
  duration_Lt?: InputMaybe<Scalars['Int']['input']>;
  duration_Lte?: InputMaybe<Scalars['Int']['input']>;
  file_Id?: InputMaybe<Scalars['Decimal']['input']>;
  file_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  initialTimestamp?: InputMaybe<Scalars['DateTime']['input']>;
  initialTimestamp_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  initialTimestamp_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  initialTimestamp_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  initialTimestamp_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  sampleDepth?: InputMaybe<Scalars['Int']['input']>;
  sampleDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  sampleDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  sampleDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  sampleDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  samplingFrequency?: InputMaybe<Scalars['Int']['input']>;
  samplingFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  samplingFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  samplingFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  samplingFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
};


/** Global query */
export type QueryAllAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyId?: InputMaybe<Scalars['ID']['input']>;
  bibliographyId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contactId?: InputMaybe<Scalars['ID']['input']>;
  contactId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institutions?: InputMaybe<Scalars['Decimal']['input']>;
  institutions_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_Gt?: InputMaybe<Scalars['Int']['input']>;
  order_Gte?: InputMaybe<Scalars['Int']['input']>;
  order_Lt?: InputMaybe<Scalars['Int']['input']>;
  order_Lte?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllBibliographyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['StatusEnum']['input']>;
  tags_Name?: InputMaybe<Scalars['String']['input']>;
  tags_Name_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['TypeEnum']['input']>;
};


/** Global query */
export type QueryAllCampaignsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllChannelConfigurationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  continuous?: InputMaybe<Scalars['Boolean']['input']>;
  datasetId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectorSpecification_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  dutyCycleOff?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Gt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Gte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Lt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOff_Lte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Gt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Gte?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Lt?: InputMaybe<Scalars['Int']['input']>;
  dutyCycleOn_Lte?: InputMaybe<Scalars['Int']['input']>;
  files_Id?: InputMaybe<Scalars['Decimal']['input']>;
  files_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  harvestEndingDate?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestEndingDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestStartingDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  instrumentDepth?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  instrumentDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  recorderSpecification_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  storages_Id?: InputMaybe<Scalars['Decimal']['input']>;
  storages_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllChannelConfigurationsDetectorSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfiguration_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfiguration_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectorId?: InputMaybe<Scalars['ID']['input']>;
  detectorId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  labels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  outputFormats?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllChannelConfigurationsRecorderSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfiguration_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfiguration_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hydrophoneId?: InputMaybe<Scalars['ID']['input']>;
  hydrophoneId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  recorderId?: InputMaybe<Scalars['ID']['input']>;
  recorderId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  recordingFormats?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllConfidenceSetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidenceIndicators?: InputMaybe<Scalars['ID']['input']>;
  desc?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllContactRolesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName?: InputMaybe<Scalars['String']['input']>;
  contact_FirstName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contact_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contact_LastName?: InputMaybe<Scalars['String']['input']>;
  contact_LastName_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Mail?: InputMaybe<Scalars['String']['input']>;
  contact_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  contact_Website?: InputMaybe<Scalars['String']['input']>;
  contact_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Id?: InputMaybe<Scalars['Decimal']['input']>;
  institution_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  institution_Mail?: InputMaybe<Scalars['String']['input']>;
  institution_Mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Name?: InputMaybe<Scalars['String']['input']>;
  institution_Name_Icontains?: InputMaybe<Scalars['String']['input']>;
  institution_Website?: InputMaybe<Scalars['String']['input']>;
  institution_Website_Icontains?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  projects_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projects_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  role?: InputMaybe<Scalars['RoleEnum']['input']>;
};


/** Global query */
export type QueryAllContactsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  ownedEquipments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  ownedPlatforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  performedMaintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  providedEquipments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  providedPlatforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  roles_Id?: InputMaybe<Scalars['Decimal']['input']>;
};


/** Global query */
export type QueryAllDatasetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllDeploymentMobilePositionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  datetime?: InputMaybe<Scalars['DateTime']['input']>;
  datetime_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  datetime_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  datetime_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  datetime_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentId?: InputMaybe<Scalars['ID']['input']>;
  deploymentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  depth?: InputMaybe<Scalars['Float']['input']>;
  depth_Gt?: InputMaybe<Scalars['Float']['input']>;
  depth_Gte?: InputMaybe<Scalars['Float']['input']>;
  depth_Lt?: InputMaybe<Scalars['Float']['input']>;
  depth_Lte?: InputMaybe<Scalars['Float']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  heading?: InputMaybe<Scalars['Float']['input']>;
  heading_Gt?: InputMaybe<Scalars['Float']['input']>;
  heading_Gte?: InputMaybe<Scalars['Float']['input']>;
  heading_Lt?: InputMaybe<Scalars['Float']['input']>;
  heading_Lte?: InputMaybe<Scalars['Float']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  pitch?: InputMaybe<Scalars['Float']['input']>;
  pitch_Gt?: InputMaybe<Scalars['Float']['input']>;
  pitch_Gte?: InputMaybe<Scalars['Float']['input']>;
  pitch_Lt?: InputMaybe<Scalars['Float']['input']>;
  pitch_Lte?: InputMaybe<Scalars['Float']['input']>;
  roll?: InputMaybe<Scalars['Float']['input']>;
  roll_Gt?: InputMaybe<Scalars['Float']['input']>;
  roll_Gte?: InputMaybe<Scalars['Float']['input']>;
  roll_Lt?: InputMaybe<Scalars['Float']['input']>;
  roll_Lte?: InputMaybe<Scalars['Float']['input']>;
};


/** Global query */
export type QueryAllDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  bathymetricDepth?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  campaignId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deploymentDate?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentVessel?: InputMaybe<Scalars['String']['input']>;
  deploymentVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  description_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  mobilePositions_Id?: InputMaybe<Scalars['Decimal']['input']>;
  mobilePositions_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  project_WebsiteProject_Id?: InputMaybe<Scalars['Decimal']['input']>;
  recoveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryVessel?: InputMaybe<Scalars['String']['input']>;
  recoveryVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  siteId?: InputMaybe<Scalars['ID']['input']>;
  siteId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllDetectionPropertiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  end?: InputMaybe<Scalars['DateTime']['input']>;
  end_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  end_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  end_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  end_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  file_Id?: InputMaybe<Scalars['Decimal']['input']>;
  file_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
  start_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  start_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  start_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


/** Global query */
export type QueryAllDetectorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllEquipmentModelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllEquipmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationHydrophoneSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationHydrophoneSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationRecorderSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationRecorderSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  maintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  maintenances_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  modelId?: InputMaybe<Scalars['ID']['input']>;
  modelId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  purchaseDate?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  sensitivity?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gte?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Lt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Lte?: InputMaybe<Scalars['Float']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  serialNumber_Icontains?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllFileArgs = {
  accessibility?: InputMaybe<Scalars['AccessibilityEnum']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  audioPropertiesId?: InputMaybe<Scalars['ID']['input']>;
  audioPropertiesId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  detectionPropertiesId?: InputMaybe<Scalars['ID']['input']>;
  detectionPropertiesId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  fileSize?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Gt?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Gte?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Lt?: InputMaybe<Scalars['BigInt']['input']>;
  fileSize_Lte?: InputMaybe<Scalars['BigInt']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  storageLocation?: InputMaybe<Scalars['String']['input']>;
  storageLocation_Icontains?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllFileFormatsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurationRecorderSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationRecorderSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  files_Id?: InputMaybe<Scalars['Decimal']['input']>;
  files_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllHydrophoneSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  directivity?: InputMaybe<Scalars['HydrophoneDirectivityEnum']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  maxBandwidth?: InputMaybe<Scalars['Float']['input']>;
  maxBandwidth_Gt?: InputMaybe<Scalars['Float']['input']>;
  maxBandwidth_Gte?: InputMaybe<Scalars['Float']['input']>;
  maxBandwidth_Lt?: InputMaybe<Scalars['Float']['input']>;
  maxBandwidth_Lte?: InputMaybe<Scalars['Float']['input']>;
  maxDynamicRange?: InputMaybe<Scalars['Float']['input']>;
  maxDynamicRange_Gt?: InputMaybe<Scalars['Float']['input']>;
  maxDynamicRange_Gte?: InputMaybe<Scalars['Float']['input']>;
  maxDynamicRange_Lt?: InputMaybe<Scalars['Float']['input']>;
  maxDynamicRange_Lte?: InputMaybe<Scalars['Float']['input']>;
  maxOperatingDepth?: InputMaybe<Scalars['Float']['input']>;
  maxOperatingDepth_Gt?: InputMaybe<Scalars['Float']['input']>;
  maxOperatingDepth_Gte?: InputMaybe<Scalars['Float']['input']>;
  maxOperatingDepth_Lt?: InputMaybe<Scalars['Float']['input']>;
  maxOperatingDepth_Lte?: InputMaybe<Scalars['Float']['input']>;
  minBandwidth?: InputMaybe<Scalars['Float']['input']>;
  minBandwidth_Gt?: InputMaybe<Scalars['Float']['input']>;
  minBandwidth_Gte?: InputMaybe<Scalars['Float']['input']>;
  minBandwidth_Lt?: InputMaybe<Scalars['Float']['input']>;
  minBandwidth_Lte?: InputMaybe<Scalars['Float']['input']>;
  minDynamicRange?: InputMaybe<Scalars['Float']['input']>;
  minDynamicRange_Gt?: InputMaybe<Scalars['Float']['input']>;
  minDynamicRange_Gte?: InputMaybe<Scalars['Float']['input']>;
  minDynamicRange_Lt?: InputMaybe<Scalars['Float']['input']>;
  minDynamicRange_Lte?: InputMaybe<Scalars['Float']['input']>;
  minOperatingDepth?: InputMaybe<Scalars['Float']['input']>;
  minOperatingDepth_Gt?: InputMaybe<Scalars['Float']['input']>;
  minOperatingDepth_Gte?: InputMaybe<Scalars['Float']['input']>;
  minOperatingDepth_Lt?: InputMaybe<Scalars['Float']['input']>;
  minOperatingDepth_Lte?: InputMaybe<Scalars['Float']['input']>;
  noiseFloor?: InputMaybe<Scalars['Float']['input']>;
  noiseFloor_Gt?: InputMaybe<Scalars['Float']['input']>;
  noiseFloor_Gte?: InputMaybe<Scalars['Float']['input']>;
  noiseFloor_Lt?: InputMaybe<Scalars['Float']['input']>;
  noiseFloor_Lte?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  operatingMaxTemperature?: InputMaybe<Scalars['Float']['input']>;
  operatingMaxTemperature_Gt?: InputMaybe<Scalars['Float']['input']>;
  operatingMaxTemperature_Gte?: InputMaybe<Scalars['Float']['input']>;
  operatingMaxTemperature_Lt?: InputMaybe<Scalars['Float']['input']>;
  operatingMaxTemperature_Lte?: InputMaybe<Scalars['Float']['input']>;
  operatingMinTemperature?: InputMaybe<Scalars['Float']['input']>;
  operatingMinTemperature_Gt?: InputMaybe<Scalars['Float']['input']>;
  operatingMinTemperature_Gte?: InputMaybe<Scalars['Float']['input']>;
  operatingMinTemperature_Lt?: InputMaybe<Scalars['Float']['input']>;
  operatingMinTemperature_Lte?: InputMaybe<Scalars['Float']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllInstitutionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyAuthors_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  ownedEquipments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  ownedPlatforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  performedMaintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  providedEquipments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  providedPlatforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  roles_Id?: InputMaybe<Scalars['Decimal']['input']>;
};


/** Global query */
export type QueryAllLabelSetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  labels?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllLabelsArgs = {
  acousticDetectors_Id?: InputMaybe<Scalars['Decimal']['input']>;
  acousticDetectors_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  meanDuration?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gte?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lte?: InputMaybe<Scalars['Float']['input']>;
  minFrequency?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  nickname_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  plurality?: InputMaybe<Scalars['SignalPluralityEnum']['input']>;
  shape?: InputMaybe<Scalars['SignalShapeEnum']['input']>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllMaintenanceTypesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  interval?: InputMaybe<Scalars['Float']['input']>;
  interval_Gt?: InputMaybe<Scalars['Float']['input']>;
  interval_Gte?: InputMaybe<Scalars['Float']['input']>;
  interval_Lt?: InputMaybe<Scalars['Float']['input']>;
  interval_Lte?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  maintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  maintenances_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllMaintenancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  date_Gt?: InputMaybe<Scalars['Date']['input']>;
  date_Gte?: InputMaybe<Scalars['Date']['input']>;
  date_Lt?: InputMaybe<Scalars['Date']['input']>;
  date_Lte?: InputMaybe<Scalars['Date']['input']>;
  equipmentId?: InputMaybe<Scalars['ID']['input']>;
  equipmentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  maintainerId?: InputMaybe<Scalars['ID']['input']>;
  maintainerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  maintainerInstitutionId?: InputMaybe<Scalars['ID']['input']>;
  maintainerInstitutionId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  typeId?: InputMaybe<Scalars['ID']['input']>;
  typeId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllPlatformTypesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  platforms_Id?: InputMaybe<Scalars['Decimal']['input']>;
  platforms_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllPlatformsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  maintenances_Id?: InputMaybe<Scalars['Decimal']['input']>;
  maintenances_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  providerId?: InputMaybe<Scalars['ID']['input']>;
  providerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllProjectTypesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  projects_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projects_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllProjectsArgs = {
  accessibility?: InputMaybe<Scalars['AccessibilityEnum']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaigns_Id?: InputMaybe<Scalars['Decimal']['input']>;
  campaigns_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  doi?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  financing?: InputMaybe<Scalars['FinancingEnum']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  projectGoal?: InputMaybe<Scalars['String']['input']>;
  projectGoal_Icontains?: InputMaybe<Scalars['String']['input']>;
  projectType?: InputMaybe<Scalars['Decimal']['input']>;
  projectType_Id?: InputMaybe<Scalars['Decimal']['input']>;
  projectType_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sites_Id?: InputMaybe<Scalars['Decimal']['input']>;
  sites_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lte?: InputMaybe<Scalars['Date']['input']>;
};


/** Global query */
export type QueryAllRecorderSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelsCount?: InputMaybe<Scalars['Int']['input']>;
  channelsCount_Gt?: InputMaybe<Scalars['Int']['input']>;
  channelsCount_Gte?: InputMaybe<Scalars['Int']['input']>;
  channelsCount_Lt?: InputMaybe<Scalars['Int']['input']>;
  channelsCount_Lte?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  storageSlotsCount?: InputMaybe<Scalars['Int']['input']>;
  storageSlotsCount_Gt?: InputMaybe<Scalars['Int']['input']>;
  storageSlotsCount_Gte?: InputMaybe<Scalars['Int']['input']>;
  storageSlotsCount_Lt?: InputMaybe<Scalars['Int']['input']>;
  storageSlotsCount_Lte?: InputMaybe<Scalars['Int']['input']>;
  storageType?: InputMaybe<Scalars['String']['input']>;
  storageType_Icontains?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllSitesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deployments_Id?: InputMaybe<Scalars['Decimal']['input']>;
  deployments_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllSoundsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  labels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllSourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  labels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latinName?: InputMaybe<Scalars['String']['input']>;
  latinName_Icontains?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllSpectrogramAnalysisArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaigns_Id?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllStorageSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllTagsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllUserGroupsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllWebsiteProjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAnnotationCampaignByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryAnnotationLabelsForDeploymentIdArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotation_AnnotationPhase_AnnotationCampaignId?: InputMaybe<Scalars['ID']['input']>;
  annotation_AnnotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotation_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  deploymentId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAnnotationPhaseByCampaignPhaseArgs = {
  campaignId: Scalars['ID']['input'];
  phaseType: AnnotationPhaseType;
};


/** Global query */
export type QueryAnnotationSpectrogramByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryAudioPropertyByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryAuthorByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryBibliographyArticleByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryBibliographyByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryBibliographyConferenceByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryBibliographyPosterByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryBibliographySoftwareByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryCampaignByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryChannelConfigurationByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryChannelConfigurationDetectorSpecificationByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryChannelConfigurationRecorderSpecificationByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryContactByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryContactRoleByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryDatasetByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryDeploymentByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryDeploymentMobilePositionByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryDetectionPropertyByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryEquipmentByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryFileByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryFileFormatByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryHydrophoneSpecificationByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryInstitutionByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryLabelByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryMaintenanceByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryMaintenanceTypeByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryPlatformByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryPlatformTypeByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryProjectByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryProjectTypeByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryRecorderSpecificationByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QuerySiteByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QuerySoundByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QuerySourceByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryStorageSpecificationByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryTagByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryWebsiteProjetByIdArgs = {
  id: Scalars['ID']['input'];
};

export type RecorderSpecificationNode = Node & {
  __typename?: 'RecorderSpecificationNode';
  /** Number of all the channels on the recorder, even if unused. */
  channelsCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  storageMaximumCapacity?: Maybe<Array<Scalars['String']['output']>>;
  storageSlotsCount?: Maybe<Scalars['Int']['output']>;
  storageType?: Maybe<Scalars['String']['output']>;
};

export type RecorderSpecificationNodeNodeConnection = {
  __typename?: 'RecorderSpecificationNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<RecorderSpecificationNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** From SignalTrend */
export enum SignalTrendType {
  Ascending = 'Ascending',
  Descending = 'Descending',
  Flat = 'Flat',
  Modulated = 'Modulated'
}

export type SiteNode = Node & {
  __typename?: 'SiteNode';
  /** Conceptual location. A site may group together several platforms in relatively close proximity, or describes a location where regular deployments are carried out. */
  deployments: DeploymentNodeConnection;
  id: Scalars['ID']['output'];
  /** Name of the platform conceptual location. A site may group together several platforms in relatively close proximity, or describes a location where regular deployments are carried out. */
  name: Scalars['String']['output'];
  /** Project associated to this site */
  project: ProjectNodeOverride;
};


export type SiteNodeDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  bathymetricDepth?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Gte?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lt?: InputMaybe<Scalars['Int']['input']>;
  bathymetricDepth_Lte?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  campaignId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  channelConfigurations_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurations_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contacts_Id?: InputMaybe<Scalars['Decimal']['input']>;
  contacts_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deploymentDate?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  deploymentVessel?: InputMaybe<Scalars['String']['input']>;
  deploymentVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  description_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  latitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Gte?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lt?: InputMaybe<Scalars['Float']['input']>;
  longitude_Lte?: InputMaybe<Scalars['Float']['input']>;
  mobilePositions_Id?: InputMaybe<Scalars['Decimal']['input']>;
  mobilePositions_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['ID']['input']>;
  platformId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  project_WebsiteProject_Id?: InputMaybe<Scalars['Decimal']['input']>;
  recoveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryDate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  recoveryVessel?: InputMaybe<Scalars['String']['input']>;
  recoveryVessel_Icontains?: InputMaybe<Scalars['String']['input']>;
  siteId?: InputMaybe<Scalars['ID']['input']>;
  siteId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type SiteNodeConnection = {
  __typename?: 'SiteNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SiteNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `SiteNode` and its cursor. */
export type SiteNodeEdge = {
  __typename?: 'SiteNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<SiteNode>;
};

export type SiteNodeNodeConnection = {
  __typename?: 'SiteNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<SiteNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type SoundNode = Node & {
  __typename?: 'SoundNode';
  children: SoundNodeConnection;
  codeName?: Maybe<Scalars['String']['output']>;
  englishName: Scalars['String']['output'];
  frenchName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  labels: LabelNodeConnection;
  parent?: Maybe<SoundNode>;
  relatedBibliography: BibliographyNodeConnection;
  taxon?: Maybe<Scalars['String']['output']>;
};


export type SoundNodeChildrenArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  labels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type SoundNodeLabelsArgs = {
  acousticDetectors_Id?: InputMaybe<Scalars['Decimal']['input']>;
  acousticDetectors_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  meanDuration?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gte?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lte?: InputMaybe<Scalars['Float']['input']>;
  minFrequency?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  nickname_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  plurality?: InputMaybe<Scalars['SignalPluralityEnum']['input']>;
  shape?: InputMaybe<Scalars['SignalShapeEnum']['input']>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type SoundNodeRelatedBibliographyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['StatusEnum']['input']>;
  tags_Name?: InputMaybe<Scalars['String']['input']>;
  tags_Name_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['TypeEnum']['input']>;
};

export type SoundNodeConnection = {
  __typename?: 'SoundNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SoundNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `SoundNode` and its cursor. */
export type SoundNodeEdge = {
  __typename?: 'SoundNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<SoundNode>;
};

export type SoundNodeNodeConnection = {
  __typename?: 'SoundNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<SoundNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type SourceNode = Node & {
  __typename?: 'SourceNode';
  children: SourceNodeConnection;
  codeName?: Maybe<Scalars['String']['output']>;
  englishName: Scalars['String']['output'];
  frenchName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  labels: LabelNodeConnection;
  latinName?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<SourceNode>;
  relatedBibliography: BibliographyNodeConnection;
  taxon?: Maybe<Scalars['String']['output']>;
};


export type SourceNodeChildrenArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  labels_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latinName?: InputMaybe<Scalars['String']['input']>;
  latinName_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type SourceNodeLabelsArgs = {
  acousticDetectors_Id?: InputMaybe<Scalars['Decimal']['input']>;
  acousticDetectors_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelConfigurationDetectorSpecifications_Id?: InputMaybe<Scalars['Decimal']['input']>;
  channelConfigurationDetectorSpecifications_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  children_Id?: InputMaybe<Scalars['Decimal']['input']>;
  children_Id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  labels_Id?: InputMaybe<Scalars['Decimal']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  maxFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  meanDuration?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Gte?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lt?: InputMaybe<Scalars['Float']['input']>;
  meanDuration_Lte?: InputMaybe<Scalars['Float']['input']>;
  minFrequency?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Gte?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lt?: InputMaybe<Scalars['Int']['input']>;
  minFrequency_Lte?: InputMaybe<Scalars['Int']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  nickname_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  plurality?: InputMaybe<Scalars['SignalPluralityEnum']['input']>;
  shape?: InputMaybe<Scalars['SignalShapeEnum']['input']>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type SourceNodeRelatedBibliographyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['StatusEnum']['input']>;
  tags_Name?: InputMaybe<Scalars['String']['input']>;
  tags_Name_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['TypeEnum']['input']>;
};

export type SourceNodeConnection = {
  __typename?: 'SourceNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SourceNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `SourceNode` and its cursor. */
export type SourceNodeEdge = {
  __typename?: 'SourceNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<SourceNode>;
};

export type SourceNodeNodeConnection = {
  __typename?: 'SourceNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<SourceNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** SpectrogramAnalysis schema */
export type SpectrogramAnalysisNode = ExtendedInterface & {
  __typename?: 'SpectrogramAnalysisNode';
  annotationCampaigns: AnnotationCampaignNodeConnection;
  annotations: AnnotationNodeConnection;
  colormap: ColormapNode;
  createdAt: Scalars['DateTime']['output'];
  /** Duration of the segmented data (in s) */
  dataDuration?: Maybe<Scalars['Float']['output']>;
  dataset: DatasetNode;
  description?: Maybe<Scalars['String']['output']>;
  dynamicMax: Scalars['Float']['output'];
  dynamicMin: Scalars['Float']['output'];
  end?: Maybe<Scalars['DateTime']['output']>;
  fft: FftNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  legacy: Scalars['Boolean']['output'];
  legacyConfiguration?: Maybe<LegacySpectrogramConfigurationNode>;
  name: Scalars['String']['output'];
  owner: UserNode;
  path: Scalars['String']['output'];
  spectrograms?: Maybe<SpectrogramNodeNodeConnection>;
  start?: Maybe<Scalars['DateTime']['output']>;
};


/** SpectrogramAnalysis schema */
export type SpectrogramAnalysisNodeAnnotationCampaignsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  phases_AnnotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  phases_Phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};


/** SpectrogramAnalysis schema */
export type SpectrogramAnalysisNodeAnnotationsArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** SpectrogramAnalysis schema */
export type SpectrogramAnalysisNodeSpectrogramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotatedByAnnotator?: InputMaybe<Scalars['ID']['input']>;
  annotatedByDetector?: InputMaybe<Scalars['ID']['input']>;
  annotatedWithConfidence?: InputMaybe<Scalars['String']['input']>;
  annotatedWithFeatures?: InputMaybe<Scalars['Boolean']['input']>;
  annotatedWithLabel?: InputMaybe<Scalars['String']['input']>;
  annotatorId?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  end?: InputMaybe<Scalars['DateTime']['input']>;
  end_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  end_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  end_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  end_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hasAnnotations?: InputMaybe<Scalars['Boolean']['input']>;
  isTaskCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  phaseType?: InputMaybe<AnnotationPhaseType>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
  start_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  start_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  start_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SpectrogramAnalysisNodeConnection = {
  __typename?: 'SpectrogramAnalysisNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SpectrogramAnalysisNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `SpectrogramAnalysisNode` and its cursor. */
export type SpectrogramAnalysisNodeEdge = {
  __typename?: 'SpectrogramAnalysisNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<SpectrogramAnalysisNode>;
};

export type SpectrogramAnalysisNodeNodeConnection = {
  __typename?: 'SpectrogramAnalysisNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<SpectrogramAnalysisNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** Spectrogram schema */
export type SpectrogramNode = ExtendedInterface & {
  __typename?: 'SpectrogramNode';
  analysis: SpectrogramAnalysisNodeConnection;
  annotationComments: AnnotationCommentNodeConnection;
  annotationTasks: AnnotationTaskNodeConnection;
  annotations: AnnotationNodeConnection;
  duration: Scalars['Int']['output'];
  end: Scalars['DateTime']['output'];
  filename: Scalars['String']['output'];
  format: FileFormatNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  start: Scalars['DateTime']['output'];
};


/** Spectrogram schema */
export type SpectrogramNodeAnalysisArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaigns_Id?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
};


/** Spectrogram schema */
export type SpectrogramNodeAnnotationCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotation_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  author?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Spectrogram schema */
export type SpectrogramNodeAnnotationTasksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotations_AcousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_Annotator?: InputMaybe<Scalars['ID']['input']>;
  annotations_Confidence_Label?: InputMaybe<Scalars['String']['input']>;
  annotations_Detector?: InputMaybe<Scalars['ID']['input']>;
  annotations_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_LabelName?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  spectrogram_End_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  spectrogram_Filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  spectrogram_Start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<AnnotationTaskStatus>;
};


/** Spectrogram schema */
export type SpectrogramNodeAnnotationsArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type SpectrogramNodeNodeConnection = {
  __typename?: 'SpectrogramNodeNodeConnection';
  end?: Maybe<Scalars['DateTime']['output']>;
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<SpectrogramNode>>;
  start?: Maybe<Scalars['DateTime']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type StorageSpecificationNode = Node & {
  __typename?: 'StorageSpecificationNode';
  capacity: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type StorageSpecificationNodeNodeConnection = {
  __typename?: 'StorageSpecificationNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<StorageSpecificationNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type SubmitAnnotationTaskMutation = {
  __typename?: 'SubmitAnnotationTaskMutation';
  annotationErrors?: Maybe<Array<Maybe<Array<Maybe<ErrorType>>>>>;
  ok: Scalars['Boolean']['output'];
  taskCommentsErrors?: Maybe<Array<Maybe<Array<Maybe<ErrorType>>>>>;
};

export type TagNode = Node & {
  __typename?: 'TagNode';
  bibliographySet: BibliographyNodeConnection;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};


export type TagNodeBibliographySetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['StatusEnum']['input']>;
  tags_Name?: InputMaybe<Scalars['String']['input']>;
  tags_Name_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['TypeEnum']['input']>;
};

export type TagNodeConnection = {
  __typename?: 'TagNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TagNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `TagNode` and its cursor. */
export type TagNodeEdge = {
  __typename?: 'TagNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<TagNode>;
};

export type TagNodeNodeConnection = {
  __typename?: 'TagNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<TagNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type UpdateAnnotationCampaignMutationInput = {
  allowPointAnnotation?: InputMaybe<Scalars['Boolean']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  confidenceSet?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  labelSet?: InputMaybe<Scalars['ID']['input']>;
  labelsWithAcousticFeatures?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type UpdateAnnotationCampaignMutationPayload = {
  __typename?: 'UpdateAnnotationCampaignMutationPayload';
  annotationCampaign?: Maybe<AnnotationCampaignNode>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors: Array<ErrorType>;
};

export type UpdateAnnotationCommentsMutationInput = {
  annotationId?: InputMaybe<Scalars['ID']['input']>;
  campaignId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  list: Array<InputMaybe<AnnotationCommentInput>>;
  phaseType: AnnotationPhaseType;
  spectrogramId: Scalars['ID']['input'];
};

export type UpdateAnnotationCommentsMutationPayload = {
  __typename?: 'UpdateAnnotationCommentsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<Maybe<Array<Maybe<ErrorType>>>>>;
};

export type UpdateAnnotationPhaseFileRangesMutation = {
  __typename?: 'UpdateAnnotationPhaseFileRangesMutation';
  errors: Array<Maybe<Array<ErrorType>>>;
};

export type UpdateAnnotationsMutationInput = {
  campaignId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  list: Array<InputMaybe<AnnotationInput>>;
  phaseType: AnnotationPhaseType;
  spectrogramId: Scalars['ID']['input'];
};

export type UpdateAnnotationsMutationPayload = {
  __typename?: 'UpdateAnnotationsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<Maybe<Array<Maybe<ErrorType>>>>>;
};

export type UpdateUserMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Update user mutation */
export type UpdateUserMutationPayload = {
  __typename?: 'UpdateUserMutationPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors: Array<ErrorType>;
  user?: Maybe<UserNode>;
};

export type UpdateUserPasswordMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

/** Update password mutation */
export type UpdateUserPasswordMutationPayload = {
  __typename?: 'UpdateUserPasswordMutationPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  newPassword: Scalars['String']['output'];
  oldPassword: Scalars['String']['output'];
};

/** User group node */
export type UserGroupNode = ExtendedInterface & {
  __typename?: 'UserGroupNode';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  users?: Maybe<Array<Maybe<UserNode>>>;
};

export type UserGroupNodeConnection = {
  __typename?: 'UserGroupNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<UserGroupNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `UserGroupNode` and its cursor. */
export type UserGroupNodeEdge = {
  __typename?: 'UserGroupNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<UserGroupNode>;
};

export type UserGroupNodeNodeConnection = {
  __typename?: 'UserGroupNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<UserGroupNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** User node */
export type UserNode = ExtendedInterface & {
  __typename?: 'UserNode';
  annotationComments: AnnotationCommentNodeConnection;
  annotationFileRanges: AnnotationFileRangeNodeConnection;
  annotationResultsValidation: AnnotationValidationNodeConnection;
  annotationTasks: AnnotationTaskNodeConnection;
  annotationcampaignSet: AnnotationCampaignNodeConnection;
  annotations: AnnotationNodeConnection;
  annotatorGroups: UserGroupNodeConnection;
  archives: ArchiveNodeConnection;
  createdPhases: AnnotationPhaseNodeConnection;
  datasetSet: DatasetNodeConnection;
  dateJoined: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  endedPhases: AnnotationPhaseNodeConnection;
  expertise?: Maybe<ExpertiseLevelType>;
  firstName: Scalars['String']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean']['output'];
  isAdmin: Scalars['Boolean']['output'];
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars['Boolean']['output'];
  /** Designates that this user has all permissions without explicitly assigning them. */
  isSuperuser: Scalars['Boolean']['output'];
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  lastName: Scalars['String']['output'];
  spectrogramAnalysis: SpectrogramAnalysisNodeConnection;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
};


/** User node */
export type UserNodeAnnotationCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotation_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  author?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** User node */
export type UserNodeAnnotationFileRangesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationPhase_AnnotationCampaign?: InputMaybe<Scalars['ID']['input']>;
  annotationPhase_Phase?: InputMaybe<AnnotationPhaseType>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** User node */
export type UserNodeAnnotationResultsValidationArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** User node */
export type UserNodeAnnotationTasksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotations_AcousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_Annotator?: InputMaybe<Scalars['ID']['input']>;
  annotations_Confidence_Label?: InputMaybe<Scalars['String']['input']>;
  annotations_Detector?: InputMaybe<Scalars['ID']['input']>;
  annotations_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  annotations_LabelName?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  spectrogram_End_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  spectrogram_Filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  spectrogram_Start_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<AnnotationTaskStatus>;
};


/** User node */
export type UserNodeAnnotationcampaignSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  phases_AnnotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  phases_Phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};


/** User node */
export type UserNodeAnnotationsArgs = {
  acousticFeatures_Exists?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  annotator?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  confidence_Label?: InputMaybe<Scalars['String']['input']>;
  detectorConfiguration_Detector?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  isValidatedBy?: InputMaybe<Scalars['ID']['input']>;
  label_Name?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** User node */
export type UserNodeAnnotatorGroupsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** User node */
export type UserNodeArchivesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  byUser?: InputMaybe<Scalars['ID']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** User node */
export type UserNodeCreatedPhasesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaignId?: InputMaybe<Scalars['ID']['input']>;
  annotationCampaign_OwnerId?: InputMaybe<Scalars['ID']['input']>;
  annotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isCampaignArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};


/** User node */
export type UserNodeDatasetSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
};


/** User node */
export type UserNodeEndedPhasesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaignId?: InputMaybe<Scalars['ID']['input']>;
  annotationCampaign_OwnerId?: InputMaybe<Scalars['ID']['input']>;
  annotationFileRanges_AnnotatorId?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isCampaignArchived?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  phase?: InputMaybe<AnnotationPhaseType>;
  search?: InputMaybe<Scalars['String']['input']>;
};


/** User node */
export type UserNodeSpectrogramAnalysisArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annotationCampaigns_Id?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  dataset?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
};

export type UserNodeNodeConnection = {
  __typename?: 'UserNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<UserNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** Project node */
export type WebsiteProjectNode = ExtendedInterface & {
  __typename?: 'WebsiteProjectNode';
  body: Scalars['String']['output'];
  end?: Maybe<Scalars['Date']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  intro: Scalars['String']['output'];
  metadataxProject?: Maybe<ProjectNodeOverride>;
  otherContacts?: Maybe<Array<Scalars['String']['output']>>;
  start?: Maybe<Scalars['Date']['output']>;
  thumbnail: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type WebsiteProjectNodeNodeConnection = {
  __typename?: 'WebsiteProjectNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<WebsiteProjectNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};
