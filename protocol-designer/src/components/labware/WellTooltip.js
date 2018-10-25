// @flow
import * as React from 'react'

import {Popper, Reference, Manager} from 'react-popper'
import cx from 'classnames'
import type {LocationLiquidState} from '../../step-generation'
import {PillTooltipContents} from '../steplist/SubstepRow'
import type {WellIngredientNames} from '../../steplist/types'
import {Portal} from '../portals/TopPortal'

import styles from './labware.css'

const TOOLTIP_OFFSET = 22

type WellTooltipParams = {
  makeHandleMouseOverWell: (wellName: string, wellIngreds: LocationLiquidState) => (e: SyntheticMouseEvent<*>) => void,
  handleMouseLeaveWell: (e: SyntheticMouseEvent<*>) => void,
  tooltipWellName: ?string,
}

type Props = {
  children: (WellTooltipParams) => React.Node,
  ingredNames: WellIngredientNames,
}

type State = {
  tooltipX: ?number,
  tooltipY: ?number,
  tooltipWellName: ?string,
  tooltipWellIngreds: ?LocationLiquidState,
}
const initialState: State = {
  tooltipX: null,
  tooltipY: null,
  tooltipWellName: null,
  tooltipWellIngreds: null,
}

class WellTooltip extends React.Component<Props, State> {
  state: State = initialState

  makeHandleMouseOverWell = (wellName: string, wellIngreds: LocationLiquidState) => (e: SyntheticMouseEvent<*>) => {
    const {target} = e
    if (target instanceof Element) {
      const wellBoundingRect = target.getBoundingClientRect()
      const {left, top, height, width} = wellBoundingRect
      if (Object.keys(wellIngreds).length > 0 && left && top) {
        this.setState({
          tooltipX: left + (width / 2),
          tooltipY: top + (height / 2),
          tooltipWellName: wellName,
          tooltipWellIngreds: wellIngreds,
        })
      }
    }
  }

  handleMouseLeaveWell = (e: SyntheticMouseEvent<*>) => {
    this.setState(initialState)
  }

  render () {
    const {tooltipX, tooltipY} = this.state

    return (
      <React.Fragment>
        <Manager>
          <Reference>
            {({ref}) => (
              <Portal>
                <div
                  ref={ref}
                  className={styles.virtual_reference}
                  style={{top: tooltipY, left: tooltipX}}></div>
              </Portal>
            )}
          </Reference>
          {this.props.children({
            makeHandleMouseOverWell: this.makeHandleMouseOverWell,
            handleMouseLeaveWell: this.handleMouseLeaveWell,
            tooltipWellName: this.state.tooltipWellName,
          })}
          {this.state.tooltipWellName &&
            <Popper modifiers={{offset: {offset: `0, ${TOOLTIP_OFFSET}`}}} >
              {({ref, style, placement, arrowProps}) => {
                return (
                  <Portal>
                    <div
                      style={style}
                      ref={ref}
                      data-placement={placement}
                      className={styles.tooltip_box}>
                      <PillTooltipContents
                        well={this.state.tooltipWellName || ''}
                        ingredNames={this.props.ingredNames}
                        ingreds={this.state.tooltipWellIngreds || {}} />
                      <div className={cx(styles.arrow, styles[placement])} ref={arrowProps.ref} style={arrowProps.style} />
                    </div>
                  </Portal>
                )
              }}
            </Popper>
          }
        </Manager>
      </React.Fragment>
    )
  }
}

export default WellTooltip