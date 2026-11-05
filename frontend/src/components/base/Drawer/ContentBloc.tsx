import React, { HTMLAttributes } from "react";
import { Note, NoteProps } from "@/components/base";
import styles from './Drawer.module.scss'

export type ContentBlocProps = HTMLAttributes<HTMLDivElement>
export const ContentBloc: React.FC<ContentBlocProps> = ({ className, ...props }) => (
    <div className={ [ styles.ContentBloc, className ].join(' ') }
         { ...props }/>
)

export type ContentBlocLabelProps = Omit<NoteProps, 'color'>
export const ContentBlocLabel: React.FC<ContentBlocLabelProps> = (props) => (
    <Note color='medium' { ...props }/>
)

export type ContentBlocContentProps = Omit<NoteProps, 'color'>
export const ContentBlocContent: React.FC<ContentBlocContentProps> = (props) => (
    <Note  { ...props }/>
)
