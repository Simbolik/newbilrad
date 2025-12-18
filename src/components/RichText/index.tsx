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
  MediaBlock as MediaBlockProps,
} from '@/payload-types'

type CTABlockProps = {
  richText?: DefaultTypedEditorState | null
  links?: {
    link: {
      type?: 'reference' | 'custom' | null
      newTab?: boolean | null
      reference?: { relationTo: 'pages' | 'posts'; value: number | string } | null
      url?: string | null
      label: string
      appearance?: 'default' | 'outline' | null
    }
  }[] | null
  blockName?: string | null
  blockType: 'cta'
}
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
    upload: ({ node }) => {
      // Get the media value - could be in node.value or node.fields.value
      const value = (node as any).value || node.fields?.value
      if (!value || typeof value !== 'object') return null
      
      // Get caption - check inline caption from node.fields first, then from media document
      const inlineCaption = node.fields?.caption
      const mediaCaption = value.caption
      
      const img = (
        <img
          src={value.url || ''}
          alt={value.alt || ''}
          width={value.width || 800}
          height={value.height || 600}
          className="w-full h-auto"
          loading="lazy"
        />
      )
      
      // Check for inline caption (string type from Lexical upload field)
      if (inlineCaption && typeof inlineCaption === 'string' && inlineCaption.trim()) {
        return (
          <figure>
            {img}
            <figcaption>{inlineCaption.trim()}</figcaption>
          </figure>
        )
      }
      
      // Check for richText caption from media document
      if (mediaCaption && typeof mediaCaption === 'object' && (mediaCaption as any).root) {
        const root = (mediaCaption as any).root
        const children = root.children || []
        
        // Extract plain text from caption
        let captionText = ''
        children.forEach((child: any) => {
          if (child.type === 'paragraph' && child.children) {
            child.children.forEach((c: any) => {
              if (c.text) captionText += c.text
            })
          } else if (child.type === 'text' && child.text) {
            captionText += child.text
          }
        })
        
        if (captionText.trim()) {
          return (
            <figure>
              {img}
              <figcaption>{captionText.trim()}</figcaption>
            </figure>
          )
        }
      }
      
      return img
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
