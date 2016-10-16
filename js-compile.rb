#!/usr/bin/ruby
# c.f. http://d.hatena.ne.jp/zariganitosh/20140814/making_of_closure_compiler_command

require 'optparse'
require 'net/http'
require 'uri'

compilation_level_names = Hash.new{|h,k| k}
compilation_level_names.merge!({'1'=>'WHITESPACE_ONLY', '2'=>'SIMPLE_OPTIMIZATIONS', '3'=>'ADVANCED_OPTIMIZATIONS'})
option_hash = {}
bookmarklet = false
OptionParser.new do |opt|
  opt.on('-l', '--compilation_level=STR|NUM', 'WHITESPACE_ONLY | SIMPLE_OPTIMIZATIONS | ADVANCED_OPTIMIZATIONS (Default:WHITESPACE_ONLY)',
                                             '1               | 2                    | 3                      (Default:1              )') {|v| option_hash[:compilation_level] = compilation_level_names[v]}
  opt.on('--output_format=STR', 'text | xml | json (Default:text)') {|v| option_hash[:output_format] = v }
  opt.on('--pretty_print', 'Add new line and indent for readable code.') {|v| option_hash[:formatting] = 'pretty_print' }
  opt.on('-b', '--bookmarklet') {|v| bookmarklet = true }
  opt.on('Example:', 
         '    cat FILE_PATH | js-compile.rb --compilation_level=WHITESPACE_ONLY --pretty_print', 
         '    cat FILE_PATH | js-compile.rb -l1 --pretty_print', 
         '    cat FILE_PATH | js-compile.rb --pretty_print', 
         '    js-compile.rb --pretty_print "`cat FILE_PATH`"', 
         'The above commands output same compiled codes.')
  
  opt.parse!(ARGV)
end
#p option_hash

url = URI('http://closure-compiler.appspot.com/compile')
input =  URI.decode(ARGV[0] || STDIN.gets(nil))
params = {js_code:input, 
          compilation_level:'WHITESPACE_ONLY',
          output_format:'text',
          output_info:'compiled_code'}
res = Net::HTTP.post_form(url, params.merge(option_hash))
puts((bookmarklet ? 'javascript:' : '') + res.body.gsub("\n",''))
STDERR.puts "", "Before: #{input.length}", "After : #{res.body.length}", "Rate  : #{res.body.length.to_f / input.length.to_f * 100}"
