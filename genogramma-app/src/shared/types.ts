export type PersonGender = 'male' | 'female'

export type NodeType =
  | 'male'
  | 'female'
  | 'unknown'
  | 'deceased-male'
  | 'deceased-female'
  | 'deceased-unknown'
  | 'twins-male'
  | 'twins-female'
  | 'foster-child'
  | 'abortion-unknown'
  | 'abortion-male'
  | 'abortion-female'
  | 'system-boundary'
  | 'pet'

export type EdgeType =
  | 'married'
  | 'separated'
  | 'divorced'
  | 'cohabiting'
  | 'separated-cohabiting'
  | 'parent-child'

export type Band = 'origin' | 'nuclear' | 'derived'

export interface PersonData {
  label: string
  birthDay?: string
  birthMonth?: string
  birthYear?: string
  deathDay?: string
  deathMonth?: string
  deathYear?: string
  profession?: string
  adjectives: string[]
  notes?: string
  band?: Band
  petType?: 'dog' | 'cat' | 'other'
}

export interface GenogramProject {
  nodes: import('reactflow').Node<PersonData>[]
  edges: import('reactflow').Edge[]
}
