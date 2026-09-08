import type { Generator } from '../types'
import { csirNetGenerators } from './csirNet'
import { sscGenerators } from './ssc'
import { ugcNetGenerators } from './ugcNet'
import { bankingGenerators } from './banking'

/**
 * Single source of truth mapping a "generator key" (referenced from
 * exam configuration files) to the actual generator function. Adding a
 * new exam means adding a new object here — nothing else in the engine
 * needs to change.
 */
export const generatorRegistry: Record<string, Generator> = {
  ...csirNetGenerators,
  ...sscGenerators,
  ...ugcNetGenerators,
  ...bankingGenerators,
}
