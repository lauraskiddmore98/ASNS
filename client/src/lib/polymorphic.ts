import * as React from 'react'
import { Slot } from "@radix-ui/react-slot"

type ElementType = keyof JSX.IntrinsicElements | typeof Slot

type AsChildProp = {
  asChild?: boolean
}

type BaseProps = {
  className?: string
}

export type PolymorphicProps<
  Element extends ElementType,
  Props extends BaseProps = BaseProps
> = Props &
  AsChildProp &
  Omit<React.ComponentPropsWithoutRef<Element>, keyof Props | keyof AsChildProp> & {
    ref?: React.ComponentPropsWithRef<Element>['ref']
  }

export type SlottableProps<Props extends BaseProps = BaseProps> = Props & AsChildProp

export type SlottableElement = React.ElementRef<typeof Slot>