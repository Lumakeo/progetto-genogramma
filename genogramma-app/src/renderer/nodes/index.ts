import { MaleNode } from './MaleNode'
import { FemaleNode } from './FemaleNode'
import { UnknownNode } from './UnknownNode'
import { DeceasedMaleNode } from './DeceasedMaleNode'
import { DeceasedFemaleNode } from './DeceasedFemaleNode'
import { DeceasedUnknownNode } from './DeceasedUnknownNode'
import { TwinsMaleNode } from './TwinsMaleNode'
import { TwinsFemaleNode } from './TwinsFemaleNode'
import { AbortionUnknownNode } from './AbortionUnknownNode'
import { AbortionMaleNode } from './AbortionMaleNode'
import { AbortionFemaleNode } from './AbortionFemaleNode'
import { FosterChildNode } from './FosterChildNode'
import { SystemBoundaryNode } from './SystemBoundaryNode'
import { PetNode } from './PetNode'

export const nodeTypes = {
  male: MaleNode,
  female: FemaleNode,
  unknown: UnknownNode,
  'deceased-male': DeceasedMaleNode,
  'deceased-female': DeceasedFemaleNode,
  'deceased-unknown': DeceasedUnknownNode,
  'twins-male': TwinsMaleNode,
  'twins-female': TwinsFemaleNode,
  'abortion-unknown': AbortionUnknownNode,
  'abortion-male': AbortionMaleNode,
  'abortion-female': AbortionFemaleNode,
  'foster-child': FosterChildNode,
  'system-boundary': SystemBoundaryNode,
  pet: PetNode
}
