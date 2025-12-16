import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  UploadJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  // Both posts and pages now use root-level URLs
  return `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => {
  return {
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    upload: ({ node, parent }) => {
      // Get the default upload JSX from the built-in converter
      const uploadJSX = UploadJSXConverter.upload({ node, parent, nodesToJSX: () => [], converters: defaultConverters, childIndex: 0 })
      
      // Extract caption from upload node
      const caption = node.fields?.caption
      
      // Check both node and parent for format/alignment
      const formatSource = ('format' in node && node.format) ? node : (parent && 'format' in parent && parent.format) ? parent : null
      
      // Build the content with optional caption
      let content = uploadJSX
      
      // Wrap image with figure if there's a caption
      if (caption && typeof caption === 'string' && caption.trim()) {
        content = (
          <figure>
            {uploadJSX}
            <figcaption>{caption}</figcaption>
          </figure>
        )
      }
      
      // Apply alignment if present
      if (formatSource && 'format' in formatSource && formatSource.format) {
        const alignStyle: React.CSSProperties = {}
        switch (formatSource.format) {
          case 'center':
            alignStyle.textAlign = 'center'
            break
          case 'right':
          case 'end':
            alignStyle.textAlign = 'right'
            break
          case 'left':
          case 'start':
            alignStyle.textAlign = 'left'
            break
        }
        
        if (alignStyle.textAlign) {
          return <div style={alignStyle}>{content}</div>
        }
      }
      
      return content
    },
    blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
}
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
