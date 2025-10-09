import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

export type SlottableProps = {
  className?: string
  asChild?: boolean
}

export type SlottableComponent = typeof Slot