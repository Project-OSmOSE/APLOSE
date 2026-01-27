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
};

export enum AccessibilityEnum {
  Confidential = 'Confidential',
  OpenAccess = 'OpenAccess',
  UponRequest = 'UponRequest'
}

export type AcousticDetectorSpecificationNode = ExtendedInterface & {
  __typename?: 'AcousticDetectorSpecificationNode';
  algorithmName?: Maybe<Scalars['String']['output']>;
  detectedLabels?: Maybe<Array<Maybe<LabelNode>>>;
  detectorSet: DetectorNodeConnection;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  maxFrequency?: Maybe<Scalars['Int']['output']>;
  minFrequency?: Maybe<Scalars['Int']['output']>;
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

export type ArticleNode = ExtendedInterface & {
  __typename?: 'ArticleNode';
  articleNb?: Maybe<Scalars['Int']['output']>;
  authors: AuthorNodeConnection;
  doi?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  issueNb?: Maybe<Scalars['Int']['output']>;
  journal: Scalars['String']['output'];
  pagesFrom?: Maybe<Scalars['Int']['output']>;
  pagesTo?: Maybe<Scalars['Int']['output']>;
  /** Required for any published bibliography */
  publicationDate?: Maybe<Scalars['Date']['output']>;
  relatedLabels: LabelNodeConnection;
  relatedProjects: ProjectNodeOverrideConnection;
  relatedSounds: SoundNodeConnection;
  relatedSources: SourceNodeConnection;
  status: BibliographyStatusEnum;
  tags?: Maybe<Array<Maybe<TagNode>>>;
  title: Scalars['String']['output'];
  type: BibliographyTypeEnum;
  volumes?: Maybe<Scalars['String']['output']>;
};


export type ArticleNodeAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyId?: InputMaybe<Scalars['ID']['input']>;
  bibliographyId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_Gt?: InputMaybe<Scalars['Int']['input']>;
  order_Gte?: InputMaybe<Scalars['Int']['input']>;
  order_Lt?: InputMaybe<Scalars['Int']['input']>;
  order_Lte?: InputMaybe<Scalars['Int']['input']>;
  personId?: InputMaybe<Scalars['ID']['input']>;
  personId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ArticleNodeRelatedLabelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  plurality?: InputMaybe<SignalPluralityEnum>;
  shape?: InputMaybe<SignalShapeEnum>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ArticleNodeRelatedProjectsArgs = {
  accessibility?: InputMaybe<AccessibilityEnum>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  financing?: InputMaybe<FinancingEnum>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectGoal?: InputMaybe<Scalars['String']['input']>;
  projectGoal_Icontains?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lte?: InputMaybe<Scalars['Date']['input']>;
};


export type ArticleNodeRelatedSoundsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type ArticleNodeRelatedSourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latinName?: InputMaybe<Scalars['String']['input']>;
  latinName_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};

export type ArticleNodeNodeConnection = {
  __typename?: 'ArticleNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<ArticleNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type AudioFileNode = ExtendedInterface & {
  __typename?: 'AudioFileNode';
  accessibility?: Maybe<AccessibilityEnum>;
  channelConfigurations: ChannelConfigurationNodeConnection;
  duration: Scalars['Int']['output'];
  /** Total number of bytes of the audio file (in bytes). */
  fileSize?: Maybe<Scalars['BigInt']['output']>;
  /** Name of the file, with extension. */
  filename: Scalars['String']['output'];
  /** Format of the audio file. */
  format: FileFormatNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  initialTimestamp: Scalars['Int']['output'];
  propertyId: Scalars['BigInt']['output'];
  sampleDepth?: Maybe<Scalars['Int']['output']>;
  samplingFrequency: Scalars['Int']['output'];
  /** Description of the path to access the data. */
  storageLocation?: Maybe<Scalars['String']['output']>;
};


export type AudioFileNodeChannelConfigurationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  continuous?: InputMaybe<Scalars['Boolean']['input']>;
  datasetId?: InputMaybe<Scalars['ID']['input']>;
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
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type AudioFileNodeNodeConnection = {
  __typename?: 'AudioFileNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<AudioFileNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type AuthorNode = ExtendedInterface & {
  __typename?: 'AuthorNode';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  institutions: InstitutionNodeConnection;
  order?: Maybe<Scalars['Int']['output']>;
  person: PersonNode;
};


export type AuthorNodeInstitutionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  city_Icontains?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  country_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  mail?: InputMaybe<Scalars['String']['input']>;
  mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  website_Icontains?: InputMaybe<Scalars['String']['input']>;
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

export enum BibliographyStatusEnum {
  Published = 'Published',
  Upcoming = 'Upcoming'
}

export enum BibliographyTypeEnum {
  Article = 'Article',
  Conference = 'Conference',
  Poster = 'Poster',
  Software = 'Software'
}

export type BibliographyUnion = ArticleNode | ConferenceNode | PosterNode | SoftwareNode;

export type BibliographyUnionConnection = {
  __typename?: 'BibliographyUnionConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<BibliographyUnionEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `BibliographyUnion` and its cursor. */
export type BibliographyUnionEdge = {
  __typename?: 'BibliographyUnionEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<BibliographyUnion>;
};

export type CampaignNode = ExtendedInterface & {
  __typename?: 'CampaignNode';
  /** Campaign during which the instrument was deployed. */
  deployments: DeploymentNodeConnection;
  /** The ID of the object */
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

export type ChannelConfigurationDetectorSpecificationNode = ExtendedInterface & {
  __typename?: 'ChannelConfigurationDetectorSpecificationNode';
  channelConfiguration?: Maybe<ChannelConfigurationNode>;
  configuration?: Maybe<Scalars['String']['output']>;
  detector: EquipmentNode;
  filter?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  labels?: Maybe<Array<Maybe<LabelNode>>>;
  /** Maximum frequency (in Hertz). */
  maxFrequency?: Maybe<Scalars['Int']['output']>;
  /** Minimum frequency (in Hertz). */
  minFrequency?: Maybe<Scalars['Int']['output']>;
  outputFormats?: Maybe<Array<Maybe<FileFormatNode>>>;
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

export type ChannelConfigurationNode = ExtendedInterface & {
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
  /** Date at which the channel configuration finished to record in (in UTC). */
  harvestEndingDate?: Maybe<Scalars['DateTime']['output']>;
  /** Date at which the channel configuration started to record (in UTC). */
  harvestStartingDate?: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Immersion depth of instrument (in positive meters). */
  instrumentDepth?: Maybe<Scalars['Int']['output']>;
  /** Each specification is dedicated to one file. */
  recorderSpecification?: Maybe<ChannelConfigurationRecorderSpecificationNode>;
  storages?: Maybe<Array<Maybe<EquipmentNode>>>;
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

export type ChannelConfigurationRecorderSpecificationNode = ExtendedInterface & {
  __typename?: 'ChannelConfigurationRecorderSpecificationNode';
  channelConfiguration?: Maybe<ChannelConfigurationNode>;
  /** Name of the channel used for recording. */
  channelName?: Maybe<Scalars['String']['output']>;
  /** Gain of the channel (recorder), with correction factors if applicable, without hydrophone sensibility (in dB). If end-to-end calibration with hydrophone sensibility, set it in Sensitivity and set Gain to 0 dB.<br>Gain G of the channel such that : data(uPa) = data(volt)*10^((-Sh-G)/20). See Sensitivity for Sh definition. */
  gain: Scalars['Float']['output'];
  hydrophone: EquipmentNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  recorder: EquipmentNode;
  recordingFormats?: Maybe<Array<Maybe<FileFormatNode>>>;
  /** Number of quantization bits used to represent each sample by the recorder channel (in bits). */
  sampleDepth: Scalars['Int']['output'];
  /** Sampling frequency of the recording channel (in Hertz). */
  samplingFrequency: Scalars['Int']['output'];
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

export type ConferenceNode = ExtendedInterface & {
  __typename?: 'ConferenceNode';
  authors: AuthorNodeConnection;
  conferenceAbstractBookUrl?: Maybe<Scalars['String']['output']>;
  conferenceLocation: Scalars['String']['output'];
  conferenceName: Scalars['String']['output'];
  doi?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Required for any published bibliography */
  publicationDate?: Maybe<Scalars['Date']['output']>;
  relatedLabels: LabelNodeConnection;
  relatedProjects: ProjectNodeOverrideConnection;
  relatedSounds: SoundNodeConnection;
  relatedSources: SourceNodeConnection;
  status: BibliographyStatusEnum;
  tags?: Maybe<Array<Maybe<TagNode>>>;
  title: Scalars['String']['output'];
  type: BibliographyTypeEnum;
};


export type ConferenceNodeAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyId?: InputMaybe<Scalars['ID']['input']>;
  bibliographyId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_Gt?: InputMaybe<Scalars['Int']['input']>;
  order_Gte?: InputMaybe<Scalars['Int']['input']>;
  order_Lt?: InputMaybe<Scalars['Int']['input']>;
  order_Lte?: InputMaybe<Scalars['Int']['input']>;
  personId?: InputMaybe<Scalars['ID']['input']>;
  personId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ConferenceNodeRelatedLabelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  plurality?: InputMaybe<SignalPluralityEnum>;
  shape?: InputMaybe<SignalShapeEnum>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type ConferenceNodeRelatedProjectsArgs = {
  accessibility?: InputMaybe<AccessibilityEnum>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  financing?: InputMaybe<FinancingEnum>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectGoal?: InputMaybe<Scalars['String']['input']>;
  projectGoal_Icontains?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lte?: InputMaybe<Scalars['Date']['input']>;
};


export type ConferenceNodeRelatedSoundsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type ConferenceNodeRelatedSourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latinName?: InputMaybe<Scalars['String']['input']>;
  latinName_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};

export type ConferenceNodeNodeConnection = {
  __typename?: 'ConferenceNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<ConferenceNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
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

export type ContactRelationNode = ExtendedInterface & {
  __typename?: 'ContactRelationNode';
  contact?: Maybe<ContactUnion>;
  contactType: Scalars['String']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  role?: Maybe<RoleEnum>;
};

export type ContactUnion = InstitutionNode | PersonNode | TeamNode;

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

export type DeploymentMobilePositionNode = ExtendedInterface & {
  __typename?: 'DeploymentMobilePositionNode';
  /** Datetime for the mobile platform position */
  datetime: Scalars['DateTime']['output'];
  /** Related deployment */
  deployment: DeploymentNode;
  /** Hydrophone depth of the mobile platform (In positive meters) */
  depth: Scalars['Float']['output'];
  /** Heading of the mobile platform */
  heading?: Maybe<Scalars['Float']['output']>;
  /** The ID of the object */
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

export type DeploymentNode = ExtendedInterface & {
  __typename?: 'DeploymentNode';
  /** Underwater depth of ocean floor at the platform position (in positive meters). */
  bathymetricDepth?: Maybe<Scalars['Int']['output']>;
  /** Campaign during which the instrument was deployed. */
  campaign?: Maybe<CampaignNode>;
  channelConfigurations: ChannelConfigurationNodeConnection;
  contacts?: Maybe<Array<Maybe<ContactRelationNode>>>;
  /** Date and time at which the measurement system was deployed in UTC. */
  deploymentDate?: Maybe<Scalars['DateTime']['output']>;
  /** Name of the vehicle associated with the deployment. */
  deploymentVessel?: Maybe<Scalars['String']['output']>;
  /** Optional description of deployment and recovery conditions (weather, technical issues,...). */
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Latitude of the platform position (WGS84 decimal degrees). */
  latitude: Scalars['Float']['output'];
  /** Longitude of the platform position (WGS84 decimal degree). */
  longitude: Scalars['Float']['output'];
  mobilePositions?: Maybe<Array<Maybe<DeploymentMobilePositionNode>>>;
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
  timezone?: InputMaybe<Scalars['String']['input']>;
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

export type DetectionFileNode = ExtendedInterface & {
  __typename?: 'DetectionFileNode';
  accessibility?: Maybe<AccessibilityEnum>;
  channelConfigurations: ChannelConfigurationNodeConnection;
  end: Scalars['Int']['output'];
  /** Total number of bytes of the audio file (in bytes). */
  fileSize?: Maybe<Scalars['BigInt']['output']>;
  /** Name of the file, with extension. */
  filename: Scalars['String']['output'];
  /** Format of the audio file. */
  format: FileFormatNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  propertyId: Scalars['BigInt']['output'];
  start: Scalars['Int']['output'];
  /** Description of the path to access the data. */
  storageLocation?: Maybe<Scalars['String']['output']>;
};


export type DetectionFileNodeChannelConfigurationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  continuous?: InputMaybe<Scalars['Boolean']['input']>;
  datasetId?: InputMaybe<Scalars['ID']['input']>;
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
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type DetectionFileNodeNodeConnection = {
  __typename?: 'DetectionFileNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<DetectionFileNode>>;
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

export type EquipmentModelNode = ExtendedInterface & {
  __typename?: 'EquipmentModelNode';
  batterySlotsCount?: Maybe<Scalars['Int']['output']>;
  batteryType?: Maybe<Scalars['String']['output']>;
  cables?: Maybe<Scalars['String']['output']>;
  equipments: EquipmentNodeConnection;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  provider: InstitutionNode;
  specifications?: Maybe<Array<Maybe<EquipmentSpecificationUnion>>>;
};


export type EquipmentModelNodeEquipmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  purchaseDate?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  sensitivity?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gte?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
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

export type EquipmentNode = ExtendedInterface & {
  __typename?: 'EquipmentNode';
  channelConfigurationDetectorSpecifications: ChannelConfigurationDetectorSpecificationNodeConnection;
  channelConfigurationHydrophoneSpecifications: ChannelConfigurationRecorderSpecificationNodeConnection;
  channelConfigurationRecorderSpecifications: ChannelConfigurationRecorderSpecificationNodeConnection;
  channelConfigurations: ChannelConfigurationNodeConnection;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  maintenances: MaintenanceNodeConnection;
  model: EquipmentModelNode;
  name?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<ContactUnion>;
  ownerId: Scalars['BigInt']['output'];
  purchaseDate?: Maybe<Scalars['Date']['output']>;
  /** Required only for hydrophones */
  sensitivity?: Maybe<Scalars['Float']['output']>;
  serialNumber: Scalars['String']['output'];
};


export type EquipmentNodeChannelConfigurationDetectorSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  configuration?: InputMaybe<Scalars['String']['input']>;
  configuration_Icontains?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  filter_Icontains?: InputMaybe<Scalars['String']['input']>;
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


export type EquipmentNodeChannelConfigurationHydrophoneSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelName?: InputMaybe<Scalars['String']['input']>;
  channelName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  gain?: InputMaybe<Scalars['Float']['input']>;
  gain_Gt?: InputMaybe<Scalars['Float']['input']>;
  gain_Gte?: InputMaybe<Scalars['Float']['input']>;
  gain_Lt?: InputMaybe<Scalars['Float']['input']>;
  gain_Lte?: InputMaybe<Scalars['Float']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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


export type EquipmentNodeChannelConfigurationRecorderSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelName?: InputMaybe<Scalars['String']['input']>;
  channelName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  gain?: InputMaybe<Scalars['Float']['input']>;
  gain_Gt?: InputMaybe<Scalars['Float']['input']>;
  gain_Gte?: InputMaybe<Scalars['Float']['input']>;
  gain_Lt?: InputMaybe<Scalars['Float']['input']>;
  gain_Lte?: InputMaybe<Scalars['Float']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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


export type EquipmentNodeChannelConfigurationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  continuous?: InputMaybe<Scalars['Boolean']['input']>;
  datasetId?: InputMaybe<Scalars['ID']['input']>;
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

export type EquipmentSpecificationUnion = AcousticDetectorSpecificationNode | HydrophoneSpecificationNode | RecorderSpecificationNode | StorageSpecificationNode;

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

export type FileFormatNode = ExtendedInterface & {
  __typename?: 'FileFormatNode';
  channelConfigurationDetectorSpecifications: ChannelConfigurationDetectorSpecificationNodeConnection;
  channelConfigurationRecorderSpecifications: ChannelConfigurationRecorderSpecificationNodeConnection;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Format of the file */
  name: Scalars['String']['output'];
  spectrogramSet: AnnotationSpectrogramNodeConnection;
};


export type FileFormatNodeChannelConfigurationDetectorSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  configuration?: InputMaybe<Scalars['String']['input']>;
  configuration_Icontains?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  filter_Icontains?: InputMaybe<Scalars['String']['input']>;
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


export type FileFormatNodeChannelConfigurationRecorderSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  channelName?: InputMaybe<Scalars['String']['input']>;
  channelName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  gain?: InputMaybe<Scalars['Float']['input']>;
  gain_Gt?: InputMaybe<Scalars['Float']['input']>;
  gain_Gte?: InputMaybe<Scalars['Float']['input']>;
  gain_Lt?: InputMaybe<Scalars['Float']['input']>;
  gain_Lte?: InputMaybe<Scalars['Float']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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

export type FileFormatNodeNodeConnection = {
  __typename?: 'FileFormatNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<FileFormatNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type FileUnion = AudioFileNode | DetectionFileNode;

export type FileUnionConnection = {
  __typename?: 'FileUnionConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FileUnionEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `FileUnion` and its cursor. */
export type FileUnionEdge = {
  __typename?: 'FileUnionEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<FileUnion>;
};

export enum FinancingEnum {
  Mixte = 'Mixte',
  NotFinanced = 'NotFinanced',
  Private = 'Private',
  Public = 'Public'
}

export enum HydrophoneDirectivityEnum {
  BiDirectional = 'BiDirectional',
  Cardioid = 'Cardioid',
  OmniDirectional = 'OmniDirectional',
  Supercardioid = 'Supercardioid',
  UniDirectional = 'UniDirectional'
}

export type HydrophoneSpecificationNode = ExtendedInterface & {
  __typename?: 'HydrophoneSpecificationNode';
  directivity?: Maybe<HydrophoneDirectivityEnum>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Upper limiting frequency (in Hz) within a more or less flat response of the hydrophone, pre-amplification included if applicable. */
  maxBandwidth?: Maybe<Scalars['Float']['output']>;
  /** Highest level which the hydrophone can handle (dB SPL RMS or peak), pre-amplification included if applicable. */
  maxDynamicRange?: Maybe<Scalars['Float']['output']>;
  /** Maximum depth at which hydrophone operates (in positive meters). */
  maxOperatingDepth?: Maybe<Scalars['Float']['output']>;
  /** Lower limiting frequency (in Hz) for a more or less flat response of the hydrophone, pre-amplification included if applicable. */
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

export type InstitutionNode = ExtendedInterface & {
  __typename?: 'InstitutionNode';
  bibliographyAuthors: AuthorNodeConnection;
  city?: Maybe<Scalars['String']['output']>;
  contactRelations: PersonInstitutionRelationNodeConnection;
  country?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  mail?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  performedMaintenances: MaintenanceNodeConnection;
  persons: PersonNodeConnection;
  providedEquipments: EquipmentModelNodeConnection;
  providedPlatforms: PlatformNodeConnection;
  teamSet: TeamNodeConnection;
  website?: Maybe<Scalars['String']['output']>;
};


export type InstitutionNodeBibliographyAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyId?: InputMaybe<Scalars['ID']['input']>;
  bibliographyId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_Gt?: InputMaybe<Scalars['Int']['input']>;
  order_Gte?: InputMaybe<Scalars['Int']['input']>;
  order_Lt?: InputMaybe<Scalars['Int']['input']>;
  order_Lte?: InputMaybe<Scalars['Int']['input']>;
  personId?: InputMaybe<Scalars['ID']['input']>;
  personId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type InstitutionNodeContactRelationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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


export type InstitutionNodePersonsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  firstName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  lastName_Icontains?: InputMaybe<Scalars['String']['input']>;
  mail?: InputMaybe<Scalars['String']['input']>;
  mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  website_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type InstitutionNodeProvidedEquipmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  batterySlotsCount?: InputMaybe<Scalars['Int']['input']>;
  batterySlotsCount_Gt?: InputMaybe<Scalars['Int']['input']>;
  batterySlotsCount_Gte?: InputMaybe<Scalars['Int']['input']>;
  batterySlotsCount_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  batterySlotsCount_Lt?: InputMaybe<Scalars['Int']['input']>;
  batterySlotsCount_Lte?: InputMaybe<Scalars['Int']['input']>;
  batteryType?: InputMaybe<Scalars['String']['input']>;
  batteryType_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  before?: InputMaybe<Scalars['String']['input']>;
  cables?: InputMaybe<Scalars['String']['input']>;
  cables_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionNodeProvidedPlatformsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerId?: InputMaybe<Scalars['BigInt']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  providerId?: InputMaybe<Scalars['ID']['input']>;
  providerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type InstitutionNodeTeamSetArgs = {
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

export type LabelNode = ExtendedInterface & {
  __typename?: 'LabelNode';
  acousticDetectors: AcousticDetectorSpecificationNodeConnection;
  /** Other name found in the bibliography for this label */
  associatedNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  channelConfigurationDetectorSpecifications: ChannelConfigurationDetectorSpecificationNodeConnection;
  children: LabelNodeConnection;
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  labelSet: AnnotationLabelNodeConnection;
  maxFrequency?: Maybe<Scalars['Int']['output']>;
  meanDuration?: Maybe<Scalars['Float']['output']>;
  minFrequency?: Maybe<Scalars['Int']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<LabelNode>;
  plurality?: Maybe<SignalPluralityEnum>;
  shape?: Maybe<SignalShapeEnum>;
  sound?: Maybe<SoundNode>;
  source: SourceNode;
};


export type LabelNodeAcousticDetectorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  algorithmName?: InputMaybe<Scalars['String']['input']>;
  algorithmName_Icontains?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
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
  configuration?: InputMaybe<Scalars['String']['input']>;
  configuration_Icontains?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  filter_Icontains?: InputMaybe<Scalars['String']['input']>;
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


export type LabelNodeChildrenArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  plurality?: InputMaybe<SignalPluralityEnum>;
  shape?: InputMaybe<SignalShapeEnum>;
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

export type MaintenanceNode = ExtendedInterface & {
  __typename?: 'MaintenanceNode';
  date: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  equipment?: Maybe<EquipmentNode>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  maintainer: PersonNode;
  maintainerInstitution: InstitutionNode;
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

export type MaintenanceTypeNode = ExtendedInterface & {
  __typename?: 'MaintenanceTypeNode';
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
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

export type PersonInstitutionRelationNode = ExtendedInterface & {
  __typename?: 'PersonInstitutionRelationNode';
  fromDate?: Maybe<Scalars['Date']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  institution: InstitutionNode;
  person: PersonNode;
  team?: Maybe<TeamNode>;
  toDate?: Maybe<Scalars['Date']['output']>;
};

export type PersonInstitutionRelationNodeConnection = {
  __typename?: 'PersonInstitutionRelationNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PersonInstitutionRelationNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `PersonInstitutionRelationNode` and its cursor. */
export type PersonInstitutionRelationNodeEdge = {
  __typename?: 'PersonInstitutionRelationNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<PersonInstitutionRelationNode>;
};

export type PersonNode = ExtendedInterface & {
  __typename?: 'PersonNode';
  authors: AuthorNodeConnection;
  currentInstitutions?: Maybe<Array<Maybe<InstitutionNode>>>;
  firstName: Scalars['String']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  institutionRelations?: Maybe<Array<Maybe<PersonInstitutionRelationNode>>>;
  institutions: InstitutionNodeConnection;
  lastName: Scalars['String']['output'];
  mail?: Maybe<Scalars['String']['output']>;
  performedMaintenances: MaintenanceNodeConnection;
  teams: TeamNodeConnection;
  website?: Maybe<Scalars['String']['output']>;
};


export type PersonNodeAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyId?: InputMaybe<Scalars['ID']['input']>;
  bibliographyId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_Gt?: InputMaybe<Scalars['Int']['input']>;
  order_Gte?: InputMaybe<Scalars['Int']['input']>;
  order_Lt?: InputMaybe<Scalars['Int']['input']>;
  order_Lte?: InputMaybe<Scalars['Int']['input']>;
  personId?: InputMaybe<Scalars['ID']['input']>;
  personId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type PersonNodeInstitutionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  city_Icontains?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  country_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  mail?: InputMaybe<Scalars['String']['input']>;
  mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  website_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type PersonNodePerformedMaintenancesArgs = {
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


export type PersonNodeTeamsArgs = {
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

export type PersonNodeConnection = {
  __typename?: 'PersonNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PersonNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `PersonNode` and its cursor. */
export type PersonNodeEdge = {
  __typename?: 'PersonNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<PersonNode>;
};

export type PersonNodeNodeConnection = {
  __typename?: 'PersonNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<PersonNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type PlatformNode = ExtendedInterface & {
  __typename?: 'PlatformNode';
  /** Support of the deployed instruments */
  deployments: DeploymentNodeConnection;
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  maintenances: MaintenanceNodeConnection;
  name?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<ContactUnion>;
  ownerId?: Maybe<Scalars['BigInt']['output']>;
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

export type PlatformTypeNode = ExtendedInterface & {
  __typename?: 'PlatformTypeNode';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isMobile: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  platforms: PlatformNodeConnection;
};


export type PlatformTypeNodePlatformsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerId?: InputMaybe<Scalars['BigInt']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  providerId?: InputMaybe<Scalars['ID']['input']>;
  providerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  taxon?: InputMaybe<Scalars['String']['input']>;
};

export type PostSoundMutationPayload = {
  __typename?: 'PostSoundMutationPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors: Array<ErrorType>;
  sound?: Maybe<SoundNode>;
};

export type PostSourceMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  englishName: Scalars['String']['input'];
  frenchName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  latinName?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  taxon?: InputMaybe<Scalars['String']['input']>;
};

export type PostSourceMutationPayload = {
  __typename?: 'PostSourceMutationPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors: Array<ErrorType>;
  source?: Maybe<SourceNode>;
};

export type PosterNode = ExtendedInterface & {
  __typename?: 'PosterNode';
  conferenceAbstractBookUrl?: Maybe<Scalars['String']['output']>;
  conferenceLocation: Scalars['String']['output'];
  conferenceName: Scalars['String']['output'];
  doi?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  posterUrl?: Maybe<Scalars['String']['output']>;
  /** Required for any published bibliography */
  publicationDate?: Maybe<Scalars['Date']['output']>;
  status: BibliographyStatusEnum;
  tags?: Maybe<Array<Maybe<TagNode>>>;
  title: Scalars['String']['output'];
  type: BibliographyTypeEnum;
};

export type PosterNodeNodeConnection = {
  __typename?: 'PosterNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<PosterNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type ProjectNode = ExtendedInterface & {
  __typename?: 'ProjectNode';
  accessibility?: Maybe<AccessibilityEnum>;
  /** Project associated to this campaign */
  campaigns: CampaignNodeConnection;
  contacts?: Maybe<Array<Maybe<ContactRelationNode>>>;
  /** Project associated to this deployment */
  deployments: DeploymentNodeConnection;
  /** Digital Object Identifier of the data, if existing. */
  doi?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Date']['output']>;
  financing?: Maybe<FinancingEnum>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Name of the project */
  name: Scalars['String']['output'];
  /** Description of the goal of the project. */
  projectGoal?: Maybe<Scalars['String']['output']>;
  /** Description of the type of the project (e.g., research, marine renewable energies, long monitoring,...). */
  projectType?: Maybe<ProjectTypeNode>;
  /** Project associated to this site */
  sites: SiteNodeConnection;
  startDate?: Maybe<Scalars['Date']['output']>;
  websiteProject?: Maybe<WebsiteProjectNode>;
};


export type ProjectNodeCampaignsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
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


export type ProjectNodeSitesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
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

export type ProjectNodeOverride = ExtendedInterface & {
  __typename?: 'ProjectNodeOverride';
  accessibility?: Maybe<AccessibilityEnum>;
  /** Project associated to this campaign */
  campaigns: CampaignNodeConnection;
  contacts?: Maybe<Array<Maybe<ContactRelationNode>>>;
  /** Project associated to this deployment */
  deployments: DeploymentNodeConnection;
  /** Digital Object Identifier of the data, if existing. */
  doi?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Date']['output']>;
  financing?: Maybe<FinancingEnum>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Name of the project */
  name: Scalars['String']['output'];
  /** Description of the goal of the project. */
  projectGoal?: Maybe<Scalars['String']['output']>;
  /** Description of the type of the project (e.g., research, marine renewable energies, long monitoring,...). */
  projectType?: Maybe<ProjectTypeNode>;
  /** Project associated to this site */
  sites: SiteNodeConnection;
  startDate?: Maybe<Scalars['Date']['output']>;
  websiteProject?: Maybe<WebsiteProjectNode>;
};


export type ProjectNodeOverrideCampaignsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
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


export type ProjectNodeOverrideSitesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
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

export type ProjectTypeNode = ExtendedInterface & {
  __typename?: 'ProjectTypeNode';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Description of the type of the project */
  name: Scalars['String']['output'];
  /** Description of the type of the project (e.g., research, marine renewable energies, long monitoring,...). */
  projects: ProjectNodeOverrideConnection;
};


export type ProjectTypeNodeProjectsArgs = {
  accessibility?: InputMaybe<AccessibilityEnum>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  financing?: InputMaybe<FinancingEnum>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectGoal?: InputMaybe<Scalars['String']['input']>;
  projectGoal_Icontains?: InputMaybe<Scalars['String']['input']>;
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
  allAnalysisForImport?: Maybe<Array<Maybe<ImportAnalysisNode>>>;
  allAnnotationCampaigns?: Maybe<AnnotationCampaignNodeNodeConnection>;
  allAnnotationFileRanges?: Maybe<AnnotationFileRangeNodeNodeConnection>;
  allAnnotationPhases?: Maybe<AnnotationPhaseNodeNodeConnection>;
  allAnnotationSpectrograms?: Maybe<AnnotationSpectrogramNodeNodeConnection>;
  allArticle?: Maybe<ArticleNodeNodeConnection>;
  allAudioFiles?: Maybe<AudioFileNodeNodeConnection>;
  allAuthors?: Maybe<AuthorNodeNodeConnection>;
  allBibliography?: Maybe<BibliographyUnionConnection>;
  allCampaigns?: Maybe<CampaignNodeNodeConnection>;
  allChannelConfigurations?: Maybe<ChannelConfigurationNodeNodeConnection>;
  allConference?: Maybe<ConferenceNodeNodeConnection>;
  allConfidenceSets?: Maybe<ConfidenceSetNodeNodeConnection>;
  allDatasets?: Maybe<DatasetNodeNodeConnection>;
  allDatasetsForImport?: Maybe<Array<Maybe<ImportDatasetNode>>>;
  allDeployments?: Maybe<DeploymentNodeNodeConnection>;
  allDetectionFiles?: Maybe<DetectionFileNodeNodeConnection>;
  allDetectors?: Maybe<DetectorNodeNodeConnection>;
  allEquipmentModels?: Maybe<EquipmentModelNodeNodeConnection>;
  allEquipments?: Maybe<EquipmentNodeNodeConnection>;
  allFileFormats?: Maybe<FileFormatNodeNodeConnection>;
  allFiles?: Maybe<FileUnionConnection>;
  allInstitutions?: Maybe<InstitutionNodeNodeConnection>;
  allLabelSets?: Maybe<LabelSetNodeNodeConnection>;
  allLabels?: Maybe<LabelNodeNodeConnection>;
  allMaintenanceTypes?: Maybe<MaintenanceTypeNodeNodeConnection>;
  allMaintenances?: Maybe<MaintenanceNodeNodeConnection>;
  allPersons?: Maybe<PersonNodeNodeConnection>;
  allPlatformTypes?: Maybe<PlatformTypeNodeNodeConnection>;
  allPlatforms?: Maybe<PlatformNodeNodeConnection>;
  allPoster?: Maybe<PosterNodeNodeConnection>;
  allProjectTypes?: Maybe<ProjectTypeNodeNodeConnection>;
  allProjects?: Maybe<ProjectNodeOverrideNodeConnection>;
  allSites?: Maybe<SiteNodeNodeConnection>;
  allSoftware?: Maybe<SoftwareNodeNodeConnection>;
  allSounds?: Maybe<SoundNodeNodeConnection>;
  allSources?: Maybe<SourceNodeNodeConnection>;
  allSpectrogramAnalysis?: Maybe<SpectrogramAnalysisNodeNodeConnection>;
  allTeams?: Maybe<TeamNodeNodeConnection>;
  allUserGroups?: Maybe<UserGroupNodeNodeConnection>;
  allUsers?: Maybe<UserNodeNodeConnection>;
  allWebsiteProjects?: Maybe<WebsiteProjectNodeNodeConnection>;
  annotationCampaignById?: Maybe<AnnotationCampaignNode>;
  annotationLabelsForDeploymentId?: Maybe<AnnotationLabelNodeNodeConnection>;
  annotationPhaseByCampaignPhase?: Maybe<AnnotationPhaseNode>;
  annotationSpectrogramById?: Maybe<AnnotationSpectrogramNode>;
  articleById?: Maybe<ArticleNode>;
  audioFileById?: Maybe<AudioFileNode>;
  authorById?: Maybe<AuthorNode>;
  bibliographyById?: Maybe<BibliographyUnion>;
  campaignById?: Maybe<CampaignNode>;
  channelConfigurationById?: Maybe<ChannelConfigurationNode>;
  conferenceById?: Maybe<ConferenceNode>;
  currentUser?: Maybe<UserNode>;
  datasetById?: Maybe<DatasetNode>;
  deploymentById?: Maybe<DeploymentNode>;
  detectionFileById?: Maybe<DetectionFileNode>;
  equipmentById?: Maybe<EquipmentNode>;
  fileById?: Maybe<FileUnion>;
  fileFormatById?: Maybe<FileFormatNode>;
  institutionById?: Maybe<InstitutionNode>;
  labelById?: Maybe<LabelNode>;
  maintenanceById?: Maybe<MaintenanceNode>;
  personById?: Maybe<PersonNode>;
  platformById?: Maybe<PlatformNode>;
  posterById?: Maybe<PosterNode>;
  projectById?: Maybe<ProjectNode>;
  siteById?: Maybe<SiteNode>;
  softwareById?: Maybe<SoftwareNode>;
  soundById?: Maybe<SoundNode>;
  sourceById?: Maybe<SourceNode>;
  teamById?: Maybe<TeamNode>;
  websiteProjetById?: Maybe<WebsiteProjectNode>;
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
export type QueryAllArticleArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Decimal']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  journal?: InputMaybe<Scalars['String']['input']>;
  journal_Icontains?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Global query */
export type QueryAllAudioFilesArgs = {
  accessibility?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  fileSize?: InputMaybe<Scalars['Int']['input']>;
  fileSize_Gt?: InputMaybe<Scalars['Int']['input']>;
  fileSize_Gte?: InputMaybe<Scalars['Int']['input']>;
  fileSize_Lt?: InputMaybe<Scalars['Int']['input']>;
  fileSize_Lte?: InputMaybe<Scalars['Int']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Decimal']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  storageLocation?: InputMaybe<Scalars['String']['input']>;
  storageLocation_Icontains?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyId?: InputMaybe<Scalars['ID']['input']>;
  bibliographyId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_Gt?: InputMaybe<Scalars['Int']['input']>;
  order_Gte?: InputMaybe<Scalars['Int']['input']>;
  order_Lt?: InputMaybe<Scalars['Int']['input']>;
  order_Lte?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  personId?: InputMaybe<Scalars['ID']['input']>;
  personId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllBibliographyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


/** Global query */
export type QueryAllCampaignsArgs = {
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
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllChannelConfigurationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  continuous?: InputMaybe<Scalars['Boolean']['input']>;
  datasetId?: InputMaybe<Scalars['ID']['input']>;
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
  timezone?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllConferenceArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  conferenceLocation?: InputMaybe<Scalars['String']['input']>;
  conferenceLocation_Icontains?: InputMaybe<Scalars['String']['input']>;
  conferenceName?: InputMaybe<Scalars['String']['input']>;
  conferenceName_Icontains?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Decimal']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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
export type QueryAllDetectionFilesArgs = {
  accessibility?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  fileSize?: InputMaybe<Scalars['Int']['input']>;
  fileSize_Gt?: InputMaybe<Scalars['Int']['input']>;
  fileSize_Gte?: InputMaybe<Scalars['Int']['input']>;
  fileSize_Lt?: InputMaybe<Scalars['Int']['input']>;
  fileSize_Lte?: InputMaybe<Scalars['Int']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  filename_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Decimal']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  storageLocation?: InputMaybe<Scalars['String']['input']>;
  storageLocation_Icontains?: InputMaybe<Scalars['String']['input']>;
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
  batterySlotsCount?: InputMaybe<Scalars['Int']['input']>;
  batterySlotsCount_Gt?: InputMaybe<Scalars['Int']['input']>;
  batterySlotsCount_Gte?: InputMaybe<Scalars['Int']['input']>;
  batterySlotsCount_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  batterySlotsCount_Lt?: InputMaybe<Scalars['Int']['input']>;
  batterySlotsCount_Lte?: InputMaybe<Scalars['Int']['input']>;
  batteryType?: InputMaybe<Scalars['String']['input']>;
  batteryType_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  before?: InputMaybe<Scalars['String']['input']>;
  cables?: InputMaybe<Scalars['String']['input']>;
  cables_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllEquipmentsArgs = {
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
  purchaseDate?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  purchaseDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  sensitivity?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Gte?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Isnull?: InputMaybe<Scalars['Boolean']['input']>;
  sensitivity_Lt?: InputMaybe<Scalars['Float']['input']>;
  sensitivity_Lte?: InputMaybe<Scalars['Float']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  serialNumber_Icontains?: InputMaybe<Scalars['String']['input']>;
};


/** Global query */
export type QueryAllFileFormatsArgs = {
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
export type QueryAllFilesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


/** Global query */
export type QueryAllInstitutionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  city_Icontains?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  country_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  mail?: InputMaybe<Scalars['String']['input']>;
  mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  website_Icontains?: InputMaybe<Scalars['String']['input']>;
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
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
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
  plurality?: InputMaybe<SignalPluralityEnum>;
  shape?: InputMaybe<SignalShapeEnum>;
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
export type QueryAllPersonsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  firstName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  lastName_Icontains?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  mail?: InputMaybe<Scalars['String']['input']>;
  mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  website_Icontains?: InputMaybe<Scalars['String']['input']>;
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
};


/** Global query */
export type QueryAllPlatformsArgs = {
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
  ownerId?: InputMaybe<Scalars['BigInt']['input']>;
  ownerId_In?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  providerId?: InputMaybe<Scalars['ID']['input']>;
  providerId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllPosterArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  conferenceLocation?: InputMaybe<Scalars['String']['input']>;
  conferenceLocation_Icontains?: InputMaybe<Scalars['String']['input']>;
  conferenceName?: InputMaybe<Scalars['String']['input']>;
  conferenceName_Icontains?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Decimal']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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
};


/** Global query */
export type QueryAllProjectsArgs = {
  accessibility?: InputMaybe<AccessibilityEnum>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  financing?: InputMaybe<FinancingEnum>;
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
  startDate?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lte?: InputMaybe<Scalars['Date']['input']>;
};


/** Global query */
export type QueryAllSitesArgs = {
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
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Global query */
export type QueryAllSoftwareArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Decimal']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['String']['input']>;
  publicationDate?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  publicationDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  publicationPlace?: InputMaybe<Scalars['String']['input']>;
  publicationPlace_Icontains?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Global query */
export type QueryAllSoundsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
export type QueryAllTeamsArgs = {
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
export type QueryArticleByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryAudioFileByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryAuthorByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryBibliographyByIdArgs = {
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
export type QueryConferenceByIdArgs = {
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
export type QueryDetectionFileByIdArgs = {
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
export type QueryPersonByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryPlatformByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryPosterByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryProjectByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QuerySiteByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QuerySoftwareByIdArgs = {
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
export type QueryTeamByIdArgs = {
  id: Scalars['ID']['input'];
};


/** Global query */
export type QueryWebsiteProjetByIdArgs = {
  id: Scalars['ID']['input'];
};

export type RecorderSpecificationNode = ExtendedInterface & {
  __typename?: 'RecorderSpecificationNode';
  /** Number of all the channels on the recorder, even if unused. */
  channelsCount?: Maybe<Scalars['Int']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  storageMaximumCapacity?: Maybe<Array<Scalars['String']['output']>>;
  storageSlotsCount?: Maybe<Scalars['Int']['output']>;
  storageType?: Maybe<Scalars['String']['output']>;
};

export enum RoleEnum {
  ContactPoint = 'ContactPoint',
  DatasetProducer = 'DatasetProducer',
  DatasetSupplier = 'DatasetSupplier',
  Funder = 'Funder',
  MainContact = 'MainContact',
  ProductionDatabase = 'ProductionDatabase',
  ProjectManager = 'ProjectManager',
  ProjectOwner = 'ProjectOwner'
}

export enum SignalPluralityEnum {
  One = 'One',
  RepetitiveSet = 'RepetitiveSet',
  Set = 'Set'
}

export enum SignalShapeEnum {
  FrequencyModulation = 'FrequencyModulation',
  Pulse = 'Pulse',
  Stationary = 'Stationary'
}

/** From SignalTrend */
export enum SignalTrendType {
  Ascending = 'Ascending',
  Descending = 'Descending',
  Flat = 'Flat',
  Modulated = 'Modulated'
}

export type SiteNode = ExtendedInterface & {
  __typename?: 'SiteNode';
  /** Conceptual location. A site may group together several platforms in relatively close proximity, or describes a location where regular deployments are carried out. */
  deployments: DeploymentNodeConnection;
  /** The ID of the object */
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

export type SoftwareNode = ExtendedInterface & {
  __typename?: 'SoftwareNode';
  authors: AuthorNodeConnection;
  doi?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Required for any published bibliography */
  publicationDate?: Maybe<Scalars['Date']['output']>;
  publicationPlace: Scalars['String']['output'];
  relatedLabels: LabelNodeConnection;
  relatedProjects: ProjectNodeOverrideConnection;
  relatedSounds: SoundNodeConnection;
  relatedSources: SourceNodeConnection;
  repositoryUrl?: Maybe<Scalars['String']['output']>;
  status: BibliographyStatusEnum;
  tags?: Maybe<Array<Maybe<TagNode>>>;
  title: Scalars['String']['output'];
  type: BibliographyTypeEnum;
};


export type SoftwareNodeAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bibliographyId?: InputMaybe<Scalars['ID']['input']>;
  bibliographyId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_Gt?: InputMaybe<Scalars['Int']['input']>;
  order_Gte?: InputMaybe<Scalars['Int']['input']>;
  order_Lt?: InputMaybe<Scalars['Int']['input']>;
  order_Lte?: InputMaybe<Scalars['Int']['input']>;
  personId?: InputMaybe<Scalars['ID']['input']>;
  personId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type SoftwareNodeRelatedLabelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  plurality?: InputMaybe<SignalPluralityEnum>;
  shape?: InputMaybe<SignalShapeEnum>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type SoftwareNodeRelatedProjectsArgs = {
  accessibility?: InputMaybe<AccessibilityEnum>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  doi?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  endDate_Lte?: InputMaybe<Scalars['Date']['input']>;
  financing?: InputMaybe<FinancingEnum>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectGoal?: InputMaybe<Scalars['String']['input']>;
  projectGoal_Icontains?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Gte?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lt?: InputMaybe<Scalars['Date']['input']>;
  startDate_Lte?: InputMaybe<Scalars['Date']['input']>;
};


export type SoftwareNodeRelatedSoundsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type SoftwareNodeRelatedSourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  latinName?: InputMaybe<Scalars['String']['input']>;
  latinName_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};

export type SoftwareNodeNodeConnection = {
  __typename?: 'SoftwareNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<SoftwareNode>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type SoundNode = ExtendedInterface & {
  __typename?: 'SoundNode';
  children: SoundNodeConnection;
  codeName?: Maybe<Scalars['String']['output']>;
  englishName: Scalars['String']['output'];
  frenchName?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  labels: LabelNodeConnection;
  parent?: Maybe<SoundNode>;
  taxon?: Maybe<Scalars['String']['output']>;
};


export type SoundNodeChildrenArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  parentId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  taxon?: InputMaybe<Scalars['String']['input']>;
  taxon_Icontains?: InputMaybe<Scalars['String']['input']>;
};


export type SoundNodeLabelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  plurality?: InputMaybe<SignalPluralityEnum>;
  shape?: InputMaybe<SignalShapeEnum>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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

export type SourceNode = ExtendedInterface & {
  __typename?: 'SourceNode';
  children: SourceNodeConnection;
  codeName?: Maybe<Scalars['String']['output']>;
  englishName: Scalars['String']['output'];
  frenchName?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  labels: LabelNodeConnection;
  latinName?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<SourceNode>;
  taxon?: Maybe<Scalars['String']['output']>;
};


export type SourceNodeChildrenArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  codeName?: InputMaybe<Scalars['String']['input']>;
  codeName_Icontains?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  englishName_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  frenchName?: InputMaybe<Scalars['String']['input']>;
  frenchName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  plurality?: InputMaybe<SignalPluralityEnum>;
  shape?: InputMaybe<SignalShapeEnum>;
  soundId?: InputMaybe<Scalars['ID']['input']>;
  soundId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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

export type StorageSpecificationNode = ExtendedInterface & {
  __typename?: 'StorageSpecificationNode';
  capacity: Array<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type SubmitAnnotationTaskMutation = {
  __typename?: 'SubmitAnnotationTaskMutation';
  annotationErrors?: Maybe<Array<Maybe<Array<Maybe<ErrorType>>>>>;
  ok: Scalars['Boolean']['output'];
  taskCommentsErrors?: Maybe<Array<Maybe<Array<Maybe<ErrorType>>>>>;
};

export type TagNode = ExtendedInterface & {
  __typename?: 'TagNode';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type TeamNode = ExtendedInterface & {
  __typename?: 'TeamNode';
  contactRelations: PersonInstitutionRelationNodeConnection;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  institution: InstitutionNode;
  mail?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  persons: PersonNodeConnection;
  website?: Maybe<Scalars['String']['output']>;
};


export type TeamNodeContactRelationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TeamNodePersonsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  firstName_Icontains?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_In?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  lastName_Icontains?: InputMaybe<Scalars['String']['input']>;
  mail?: InputMaybe<Scalars['String']['input']>;
  mail_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  website_Icontains?: InputMaybe<Scalars['String']['input']>;
};

export type TeamNodeConnection = {
  __typename?: 'TeamNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TeamNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `TeamNode` and its cursor. */
export type TeamNodeEdge = {
  __typename?: 'TeamNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<TeamNode>;
};

export type TeamNodeNodeConnection = {
  __typename?: 'TeamNodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfoExtra;
  /** Contains the nodes in this connection. */
  results: Array<Maybe<TeamNode>>;
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
